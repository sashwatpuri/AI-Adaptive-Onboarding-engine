import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gap_analyzer import compute_gap_map
from services.roadmap_generator import generate_roadmap
from services.rag_retriever import retrieve_courses

router = APIRouter()

class RoadmapRequest(BaseModel):
    session_id: str

@router.post("/generate-roadmap")
async def create_roadmap(req: RoadmapRequest):
    start_time = time.time()
    try:
        from main import sessions
        if req.session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        sess = sessions[req.session_id]
        gap_map = compute_gap_map(sess.get("resume_skills", []), sess.get("jd_skills", []), req.session_id)
        roadmap = generate_roadmap(gap_map, req.session_id)
        
        # Populate courses for the first 2 months
        for plan in roadmap[:2]:
            for skill in plan.skills:
                courses = retrieve_courses(skill, top_k=2, session_id=req.session_id)
                plan.courses.extend(courses)
                
        sess["gap_map"] = gap_map
        sess["roadmap"] = roadmap
        
        return {
            "gap_map": gap_map,
            "roadmap": roadmap,
            "overall_readiness_pct": gap_map["overall_readiness_pct"],
            "session_id": req.session_id,
            "ms": int((time.time() - start_time) * 1000)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
