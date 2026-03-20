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
        "reasoning": f"Overall score {overall_score}% fell into bucket {action}",
        "evidence": [f"Score: {overall_score}%", f"Thresholds: Fast={config.FAST_TRACK_THRESHOLD}, Reinforce={config.REINFORCE_THRESHOLD}"],
        "confidence": 100
    })

    # Adjust future months based on action (simplified simulation)
    if action == "FAST_TRACK" and current_month_index + 1 < len(updated_roadmap):
        # Maybe shift logic 
        pass
    elif action == "REINFORCE":
        # Extend or repeat logic
        pass
    
    # Mark current as completed, next as in_progress
    if current_month_index < len(updated_roadmap):
        updated_roadmap[current_month_index]["status"] = "completed"
    if current_month_index + 1 < len(updated_roadmap):
        updated_roadmap[current_month_index + 1]["status"] = "in_progress"

    return updated_roadmap, action
