import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.simulation_grader import grade_simulation
from services.reasoning_tracer import log_reasoning

router = APIRouter()

class SimulationRequest(BaseModel):
    type: str
    response: str
    task_id: str
    session_id: str

@router.post("/run-simulation")
async def run_simulation(req: SimulationRequest):
    start_time = time.time()
    try:
        from main import sessions
        if req.session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        task = {"title": req.task_id, "description": "Simulation Task", "evaluation_criteria": ["Correctness"]}
        result = grade_simulation(task, req.response)
        
        log_reasoning(req.session_id, {
            "type": "SIMULATION_GRADE",
            "summary": f"Graded task {req.task_id}",
            "reasoning": result.get("feedback", {}).get("feedback", "Completed"),
            "evidence": [f"Score: {result.get('score')} / 3"],
            "confidence": 95
        })
        
        return {
            "score": result.get("score"),
            "label": result.get("label"),
            "feedback": result.get("feedback"),
            "next_steps": result.get("next_steps"),
            "roadmap_impact": result.get("roadmap_impact"),
            "session_id": req.session_id,
            "ms": int((time.time() - start_time) * 1000)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
