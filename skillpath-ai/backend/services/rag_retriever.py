from sentence_transformers import SentenceTransformer
import faiss, json, numpy as np
from config import config
from services.llm import call_llm

_index = None
_catalog = None
_model = None

def build_index():
  global _index, _catalog, _model
  _model = SentenceTransformer(config.EMBED_MODEL)
  
  with open(config.CATALOG_PATH) as f:
    data = json.load(f)
  _catalog = data["courses"]
  
  texts = [
    f"{c['title']}. Skills: {', '.join(c['skills_covered'])}. {c.get('description','')}"
    for c in _catalog
  ]
  embeddings = _model.encode(
    texts, normalize_embeddings=True, show_progress_bar=False
  )
  
  _index = faiss.IndexFlatIP(embeddings.shape[1])
  _index.add(embeddings.astype('float32'))
  print(f"RAG index built: {len(_catalog)} courses indexed")

def retrieve_courses(
  skill: str,
  top_k: int = 5,
  session_id: str = ""
) -> list:
  
  query = f"Course teaching {skill} from beginner to advanced"
  q_emb = _model.encode([query], normalize_embeddings=True)
  distances, indices = _index.search(
    q_emb.astype('float32'), top_k)
  
  candidates = []
  for i, idx in enumerate(indices[0]):
    c = _catalog[idx].copy()
    c["relevance_score"] = round(float(distances[0][i]) * 100)
    c["grounded"] = True
    candidates.append(c)
  
  # LLM ranking — constrained to candidates only
  RANK_SYSTEM = """
You are a course recommendation engine.
You MUST ONLY select from the provided course list.
Never suggest a course not in this list.
Rank the top 3 courses for learning the skill.
Return ONLY valid JSON:
{"recommendations":[{"id":"course_001","rank_reason":"..."}]}
"""
  result = call_llm(
    RANK_SYSTEM,
    f"Rank top 3 courses for: {skill}\n\nCourses:\n{json.dumps(candidates, indent=2)}"
  )
  
  # Validate IDs — hallucination guard
  catalog_ids = {c["id"] for c in _catalog}
  final = []
  for rec in result.get("recommendations", [])[:3]:
    cid = rec.get("id", "")
    if cid in catalog_ids:
      course = next(c for c in candidates if c["id"] == cid)
      course["rank_reason"] = rec.get("rank_reason", "")
      course["grounded"] = True
      final.append(course)
      # Log to trace
      if session_id:
        from services.reasoning_tracer import log_reasoning
        log_reasoning(session_id, {
          "type": "COURSE_SELECTION",
          "summary": f"{course['title']} selected for {skill}",
          "reasoning": rec.get("rank_reason", "High semantic match"),
          "evidence": [
            f"Relevance: {course['relevance_score']}%",
            f"Catalog ID {cid} verified",
            "Grounded: true"
          ],
          "confidence": course["relevance_score"]
        })
  
  return final if final else candidates[:3]
