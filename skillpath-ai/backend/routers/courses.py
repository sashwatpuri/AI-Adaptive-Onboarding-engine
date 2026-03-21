import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.rag_retriever import retrieve_courses

router = APIRouter()

class CourseRequest(BaseModel):
    skill: str
    month: int
    session_id: str

@router.post("/recommend-courses")
async def recommend_courses(req: CourseRequest):
    start_time = time.time()
    try:
        courses = retrieve_courses(req.skill, top_k=5, session_id=req.session_id)
        return {
            "courses": courses,
            "session_id": req.session_id,
            "ms": int((time.time() - start_time) * 1000)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
