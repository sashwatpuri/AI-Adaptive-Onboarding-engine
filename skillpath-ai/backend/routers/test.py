import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional
from services.test_generator import generate_month_test
from services.simulation_grader import grade_simulation
from services.adaptive_router import route_adaptively

router = APIRouter()

class GenerateTestRequest(BaseModel):
    month: int
    session_id: str

class SubmitTestRequest(BaseModel):
    month: int
    answers: Dict[str, str]
    simulation_response: Optional[str] = ""
    session_id: str

@router.post("/generate-test")
async def generate_test(req: GenerateTestRequest):
    start_time = time.time()
    try:
        from main import sessions
        if req.session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        roadmap = sessions[req.session_id].get("roadmap", [])
        if req.month > len(roadmap) or req.month < 1:
            raise HTTPException(status_code=404, detail="Month plan not found")
        
        plan = roadmap[req.month - 1]
        skills = plan.skills if hasattr(plan, 'skills') else plan.get("skills", [])
        has_sim = plan.has_simulation if hasattr(plan, 'has_simulation') else plan.get("has_simulation", False)

        questions, simulation_task = generate_month_test(skills, req.month, has_sim)
        
        if "test" not in sessions[req.session_id]:
            sessions[req.session_id]["test"] = {}
        
        sessions[req.session_id]["test"][str(req.month)] = {
            "questions": questions,
            "simulation_task": simulation_task
        }
        
        return {
            "questions": questions,
            "simulation_task": simulation_task,
            "session_id": req.session_id,
            "ms": int((time.time() - start_time) * 1000)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/submit-test")
async def submit_test(req: SubmitTestRequest):
    start_time = time.time()
    try:
        from main import sessions
        if req.session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
            
        test_data = sessions[req.session_id].get("test", {}).get(str(req.month))
        if not test_data:
            raise HTTPException(status_code=404, detail="Test data not found for this month")
            
        mcqs = test_data.get("questions", [])
        correct = 0
        total = len(mcqs)
        skill_scores = {}
        
        for q in mcqs:
            q_id = q["id"]
            if q_id in req.answers:
                ans_idx = None
                try:
                    ans_idx = q["options"].index(req.answers[q_id])
                except ValueError:
                    pass
                if ans_idx == q["correct_index"]:
                    correct += 1
            
        sim_score = 0
        if req.simulation_response and test_data.get("simulation_task"):
            sim_result = grade_simulation(test_data["simulation_task"], req.simulation_response)
            sim_score = sim_result.get("score", 0)
            total += 3
            correct += sim_score
            
        overall_score = int((correct / total) * 100) if total > 0 else 0
        
        roadmap = sessions[req.session_id].get("roadmap", [])
        updated_roadmap, action = route_adaptively(
            req.session_id, skill_scores, overall_score, roadmap, req.month - 1
        )
        
        sessions[req.session_id]["roadmap"] = updated_roadmap
        
        return {
            "skill_scores": skill_scores,
            "overall_score": overall_score,
            "rerouting": action,
            "updated_roadmap": updated_roadmap,
            "session_id": req.session_id,
            "ms": int((time.time() - start_time) * 1000)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
