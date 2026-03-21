import json

import numpy as np

from config import config
from services.llm import call_llm

_index = None
_catalog = None
_model = None
_initialized = False


def _score_course(skill: str, course: dict) -> int:
    skill_lower = skill.lower()
    covered = [item.lower() for item in course.get("skills_covered", [])]
    title = course.get("title", "").lower()
    description = course.get("description", "").lower()

    score = 0
    if skill_lower in covered:
        score += 60
    score += sum(20 for item in covered if skill_lower in item or item in skill_lower)
    if skill_lower in title:
        score += 15
    if skill_lower in description:
        score += 10
    score += int(float(course.get("rating", 0)) * 2)
    return score


def build_index():
    global _index, _catalog, _model, _initialized

    if _initialized:
        return

    _initialized = True

    with open(config.CATALOG_PATH) as handle:
        data = json.load(handle)
    _catalog = data.get("courses", [])

    if not config.ENABLE_EMBEDDINGS:
        _model = None
        _index = None
        return

    try:
        from sentence_transformers import SentenceTransformer
        import faiss

        _model = SentenceTransformer(config.EMBED_MODEL, local_files_only=True)
        texts = [
            f"{course['title']}. Skills: {', '.join(course['skills_covered'])}. {course.get('description', '')}"
            for course in _catalog
        ]
        embeddings = _model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
        _index = faiss.IndexFlatIP(embeddings.shape[1])
        _index.add(embeddings.astype("float32"))
        print(f"RAG index built: {len(_catalog)} courses indexed")
    except Exception as exc:
        print(f"RAG embeddings unavailable, using local ranking: {exc}")
        _model = None
        _index = None


from typing import List, Union

def retrieve_courses(skill: Union[str, List[str]], top_k: int = 5, session_id: str = "") -> list:
    # Handle list of skills by joining them or taking the first one for the query
    if isinstance(skill, list):
        if not skill:
            return []
        skill_str = ", ".join(skill)
        primary_skill = skill[0]
    else:
        skill_str = skill
        primary_skill = skill
        
    if _catalog is None:
        build_index()

    if not _catalog:
        return []

    candidates = []

    if _model is not None and _index is not None:
        try:
            query = f"Course teaching {skill_str} from beginner to advanced"
            query_embedding = _model.encode([query], normalize_embeddings=True)
            distances, indices = _index.search(query_embedding.astype("float32"), top_k)
            for position, idx in enumerate(indices[0]):
                course = _catalog[idx].copy()
                course["relevance_score"] = round(float(distances[0][position]) * 100)
                course["grounded"] = True
                candidates.append(course)
        except Exception as exc:
            print(f"Semantic course retrieval skipped: {exc}")

    if not candidates:
        # Fallback to local ranking using the primary skill
        ranked = sorted(_catalog, key=lambda course: _score_course(primary_skill, course), reverse=True)[:top_k]
        for course in ranked:
            item = course.copy()
            item["relevance_score"] = min(99, _score_course(primary_skill, course))
            item["grounded"] = True
            candidates.append(item)

    result = call_llm(
        """
You are a course recommendation engine.
You MUST ONLY select from the provided course list.
Never suggest a course not in this list.
Rank the top 3 courses for learning the skill.
Return ONLY valid JSON:
{"recommendations":[{"id":"course_001","rank_reason":"..."}]}
""",
        f"Rank top 3 courses for: {skill}\n\nCourses:\n{json.dumps(candidates, indent=2)}",
    )

    reasons = {
        rec.get("id", ""): rec.get("rank_reason", "")
        for rec in result.get("recommendations", [])
        if rec.get("id", "")
    }

    final = []
    for course in candidates[:3]:
        course["rank_reason"] = reasons.get(
            course["id"],
            f"Ranked locally for strong alignment with {skill}.",
        )
        final.append(course)

        if session_id:
            from services.reasoning_tracer import log_reasoning

            log_reasoning(
                session_id,
                {
                    "type": "COURSE_SELECTION",
                    "summary": f"{course['title']} selected for {skill}",
                    "reasoning": course["rank_reason"],
                    "evidence": [
                        f"Relevance: {course['relevance_score']}%",
                        f"Catalog ID {course['id']} verified",
                        "Grounded: true",
                    ],
                    "confidence": course["relevance_score"],
                },
            )

    return final
