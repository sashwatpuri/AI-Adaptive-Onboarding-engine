from typing import List
from models.skill import GapSkill
from models.roadmap import MonthPlan
from services.reasoning_tracer import log_reasoning

DEPENDENCIES = {
  "pandas": ["python"],
  "numpy": ["python"],
  "pytorch": ["python", "numpy"],
  "tensorflow": ["python", "numpy"],
  "ml pipelines": ["python", "pandas", "scikit-learn"],
  "scikit-learn": ["python"],
  "data modeling": ["sql"],
  "cloud architecture": ["docker", "linux"],
  "mlops": ["docker", "python", "git"],
  "react": ["javascript", "html/css"],
  "fastapi": ["python"],
  "kubernetes": ["docker"],
  "feature engineering": ["python", "pandas"],
  "deep learning": ["pytorch", "numpy"],
}

HOURS_MAP = {"CRITICAL":8, "MODERATE":5, "MINOR":3}

def generate_roadmap(
  gap_map: dict,
  session_id: str,
  max_months: int = 4,
  hours_per_month: int = 18
) -> List[MonthPlan]:
  
  # Only skills needing work
  gaps = [s for s in gap_map["skills"] 
          if s.severity != "COVERED"]
  
  if not gaps:
    return []
  
  # Sort: CRITICAL first, then by gap_score, then name
  severity_order = {"CRITICAL":0,"MODERATE":1,"MINOR":2}
  gaps.sort(key=lambda s: (
    severity_order[s.severity], -s.gap_score, s.skill))
  
  # Dependency-aware assignment
  assigned = {}  # skill_lower → month number
  covered_skills = {
    s.skill.lower() for s in gap_map["skills"]
    if s.severity == "COVERED"
  }
  
  month_hours = [0] * max_months
  month_skills = [[] for _ in range(max_months)]
  
  for gap in gaps:
    key = gap.skill.lower()
    deps = DEPENDENCIES.get(key, [])
    
    # Find earliest month where all deps are satisfied
    earliest = 0
    for dep in deps:
      if dep in covered_skills:
        continue  # already covered, no constraint
      if dep in assigned:
        earliest = max(earliest, assigned[dep])
      # If dep is a gap skill not yet assigned, 
      # it will get assigned later — skip constraint
    
    # Find first month with budget for this skill
    skill_hours = HOURS_MAP[gap.severity]
    placed = False
    for m in range(earliest, max_months):
      if month_hours[m] + skill_hours <= hours_per_month:
        month_skills[m].append(gap)
        month_hours[m] += skill_hours
        assigned[key] = m
        placed = True
        break
    
    if not placed:
      # Add to last month if overflow
      month_skills[max_months-1].append(gap)
      assigned[key] = max_months - 1
  
  # Build MonthPlan objects (skip empty months)
  plans = []
  TITLES = [
    "Foundations Sprint", "Core Skills Build",
    "Advanced Mastery", "Integration & Deploy"
  ]
  
  for m, skill_list in enumerate(month_skills):
    if not skill_list:
      continue
    
    has_tech = any(
      s.severity in ("CRITICAL","MODERATE") 
      for s in skill_list
    )
    
    plan = MonthPlan(
      month=m+1,
      title=TITLES[m] if m < len(TITLES) else f"Month {m+1}",
      skills=[s.skill for s in skill_list],
      estimated_hours=month_hours[m],
      target_levels={
        s.skill: ["Beginner","Intermediate","Advanced"][s.required_level-1]
        for s in skill_list
      },
      status="in_progress" if m == 0 else "locked",
      has_simulation=has_tech
    )
    plans.append(plan)
    
    # Log placement
    log_reasoning(session_id, {
      "type": "SKILL_PLACEMENT",
      "summary": f"Month {m+1}: {len(skill_list)} skills assigned",
      "reasoning": f"Sorted by priority (Critical→Moderate→Minor) with dependency ordering. Hours budget: {month_hours[m]}/{hours_per_month}",
      "evidence": [f"Skills: {', '.join(s.skill for s in skill_list)}", f"Estimated: {month_hours[m]} hrs"],
      "confidence": 91
    })
  
  return plans
