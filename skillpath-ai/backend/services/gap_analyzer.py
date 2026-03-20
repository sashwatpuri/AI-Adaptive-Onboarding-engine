from typing import List
from models.skill import ResumeSkill, JDSkill, GapSkill
from services.reasoning_tracer import log_reasoning

LEVEL_MAP = {"Beginner":1, "Intermediate":2, "Advanced":3}
SEVERITY = {0:"COVERED", 1:"MINOR", 2:"MODERATE", 3:"CRITICAL"}

def compute_gap_map(
  resume_skills: List[ResumeSkill],
  jd_skills: List[JDSkill],
  session_id: str
) -> dict:
  
  resume_index = {
    s.skill.lower(): s for s in resume_skills
  }
  
  gap_skills = []
  for jd_skill in jd_skills:
    key = jd_skill.skill.lower()
    resume_match = resume_index.get(key)
    
    current = LEVEL_MAP.get(
      resume_match.level, 0) if resume_match else 0
    required = LEVEL_MAP[jd_skill.level_required]
    gap = max(0, required - current)
    
    gap_skills.append(GapSkill(
      skill=jd_skill.skill,
      current_level=current,
      required_level=required,
      gap_score=gap,
      severity=SEVERITY[min(gap, 3)]
    ))
  
  covered = sum(1 for s in gap_skills 
                if s.severity == "COVERED")
  readiness = round(
    sum(s.current_level for s in gap_skills) /
    sum(s.required_level for s in gap_skills) * 100
  ) if gap_skills else 0
  
  # Log each critical skill placement
  for s in gap_skills:
    if s.severity in ("CRITICAL", "MODERATE"):
      log_reasoning(session_id, {
        "type": "GAP_ANALYSIS",
        "summary": f"{s.skill} identified as {s.severity}",
        "reasoning": f"Current: Level {s.current_level}, Required: Level {s.required_level}, Gap: {s.gap_score}",
        "evidence": [
          f"Required level: {s.required_level}/3",
          f"Current level: {s.current_level}/3",
          f"Gap score: {s.gap_score}"
        ],
        "confidence": 95
      })
  
  return {
    "skills": gap_skills,
    "overall_readiness_pct": readiness,
    "critical_count": sum(1 for s in gap_skills if s.severity=="CRITICAL"),
    "moderate_count": sum(1 for s in gap_skills if s.severity=="MODERATE"),
    "minor_count": sum(1 for s in gap_skills if s.severity=="MINOR"),
    "covered_count": covered
  }
