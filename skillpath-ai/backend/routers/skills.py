import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.skill_extractor import extract_resume_skills, extract_jd_skills

router = APIRouter()

class ExtractRequest(BaseModel):
    resume_text: str
    jd_text: str
    session_id: str

@router.post("/extract-skills")
async def extract_skills(req: ExtractRequest):
    start_time = time.time()
    try:
        from main import sessions
        if req.session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
            
        resume_skills = await extract_resume_skills(req.resume_text, req.session_id)
        jd_skills = await extract_jd_skills(req.jd_text, req.session_id)
        
        sessions[req.session_id]["resume_skills"] = resume_skills
        sessions[req.session_id]["jd_skills"] = jd_skills
        
        return {
            "resume_skills": resume_skills,
            "jd_skills": jd_skills,
            "session_id": req.session_id,
            "ms": int((time.time() - start_time) * 1000)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
