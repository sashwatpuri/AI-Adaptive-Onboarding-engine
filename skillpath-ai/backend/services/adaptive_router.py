from config import config
from models.roadmap import MonthPlan
from services.reasoning_tracer import log_reasoning

def route_adaptively(
    session_id: str,
    skill_scores: dict,
    overall_score: int,
    current_roadmap: list,
    current_month_index: int
):
    updated_roadmap = []
    
    for plan in current_roadmap:
        plan_dict = plan if isinstance(plan, dict) else plan.model_dump()
        updated_roadmap.append(plan_dict)

    action = "PROCEED"
    if overall_score < config.REINFORCE_THRESHOLD:
        action = "REINFORCE"
    elif overall_score >= config.FAST_TRACK_THRESHOLD:
        action = "FAST_TRACK"

    log_reasoning(session_id, {
        "type": "ROADMAP_REROUTE",
        "summary": f"Month {current_month_index + 1} Assessment: {action}",
        "reasoning": f"Overall score {overall_score}% fell into bucket {action}. Skill breakdown: {skill_scores}",
        "evidence": [f"Score: {overall_score}%", f"Thresholds: Fast={config.FAST_TRACK_THRESHOLD}, Reinforce={config.REINFORCE_THRESHOLD}"],
        "confidence": 100
    })

    rerouting_actions = []

    if action == "FAST_TRACK" and current_month_index + 1 < len(updated_roadmap):
        # Identify skills mastered (score > 85%) during fast track
        mastered_skills = [s for s, score in skill_scores.items() if score >= 85]
        
        # Remove mastered skills from next month
        next_month = updated_roadmap[current_month_index + 1]
        original_skills = list(next_month["skills"])
        next_month["skills"] = [s for s in next_month["skills"] if s not in mastered_skills]
        
        removed = set(original_skills) - set(next_month["skills"])
        if removed:
            rerouting_actions.append(f"Fast Track: Mastered and removed {', '.join(removed)} from Month {current_month_index + 2}")

    elif action == "REINFORCE":
        # Identify weak skills
        weak_skills = [s for s, score in skill_scores.items() if score < config.REINFORCE_THRESHOLD]
        
        if not weak_skills and current_month_index < len(updated_roadmap):
            # Fallback if specific skills weren't individually weak but overall was
            weak_skills = updated_roadmap[current_month_index]["skills"]
            
        if weak_skills:
            rerouting_actions.append(f"Reinforce: Weak performance in {', '.join(weak_skills)}")
            
            # Action 1: Insert weak skills into the NEXT month if it exists
            if current_month_index + 1 < len(updated_roadmap):
                next_month = updated_roadmap[current_month_index + 1]
                # Add weak skills that aren't already there
                for skill in weak_skills:
                    if skill not in next_month["skills"]:
                        next_month["skills"].insert(0, skill)
                rerouting_actions.append(f"Carrying over weak skills to Month {current_month_index + 2}")
            else:
                # Action 2: If we are at the end of the roadmap, add a new reinforcement month
                new_month = {
                    "month": len(updated_roadmap) + 1,
                    "title": "Reinforcement Sprint",
                    "skills": list(weak_skills),
                    "estimated_hours": 10,
                    "target_levels": {s: "Intermediate" for s in weak_skills},
                    "status": "locked",
                    "has_simulation": True,
                    "courses": []
                }
                updated_roadmap.append(new_month)
                rerouting_actions.append("Created a new reinforcement month")
    
    # Mark current as completed, next as in_progress
    if current_month_index < len(updated_roadmap):
        updated_roadmap[current_month_index]["status"] = "completed"
    if current_month_index + 1 < len(updated_roadmap):
        updated_roadmap[current_month_index + 1]["status"] = "in_progress"

    return updated_roadmap, action, rerouting_actions
