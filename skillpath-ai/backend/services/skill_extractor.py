from typing import List
from models.skill import ResumeSkill, JDSkill
from services.llm import call_llm
from services.reasoning_tracer import log_reasoning
from config import config

RESUME_SYSTEM = """
You are a precise skill extraction engine.
Extract ALL skills from the resume text.
For each skill identify:
  skill: canonical name using standard terminology
  level: exactly "Beginner", "Intermediate", or "Advanced"
  confidence: 0-100 integer based on:
    frequency of mention (40% weight)
    project context (40% weight)
    explicit descriptors (20% weight)
  evidence: 1-3 short phrases from text as proof
  category: exactly one of "Technical", 
             "Soft Skills", or "Domain Knowledge"
Return ONLY valid JSON. No explanation. No markdown.
{"skills": [{"skill":"Python","level":"Intermediate",
  "confidence":87,"evidence":["3 projects in Python"],
  "category":"Technical"}]}
"""

JD_SYSTEM = """
You are a job requirements extraction engine.
Extract ALL required skills from the job description.
For each skill identify:
  skill: canonical name
  level_required: "Beginner", "Intermediate", or "Advanced"
  is_critical: true if required, false if nice-to-have
  frequency: integer count of mentions
Return ONLY valid JSON. No explanation. No markdown.
{"skills": [{"skill":"PyTorch","level_required":"Advanced",
  "is_critical":true,"frequency":4}]}
"""

async def extract_resume_skills(text: str, session_id: str) -> List[ResumeSkill]:
    result = call_llm(RESUME_SYSTEM, f"Extract skills from this resume:\n\n{text}")
    skills = result.get("skills", [])
    # Filter low confidence
    skills = [s for s in skills if s.get("confidence",0) >= 40]
    # Deduplicate
    seen = {}
    for s in skills:
        name = s["skill"].lower()
        if name not in seen or s["confidence"] > seen[name]["confidence"]:
            seen[name] = s
    validated = list(seen.values())
    # Log to reasoning trace
    log_reasoning(session_id, {
        "type": "SKILL_EXTRACTION",
        "summary": f"Extracted {len(validated)} skills from resume",
        "reasoning": "Skills filtered by confidence ≥ 40% and deduplicated",
        "evidence": [
            f"Raw skills found: {len(skills)}",
            f"After deduplication: {len(validated)}",
            f"Model: {config.GEMINI_MODEL}"
        ],
        "confidence": 92
    })
    return [ResumeSkill(**s) for s in validated]

async def extract_jd_skills(text: str, session_id: str) -> List[JDSkill]:
    result = call_llm(JD_SYSTEM, f"Extract required skills from this JD:\n\n{text}")
    return [JDSkill(**s) for s in result.get("skills", [])]
