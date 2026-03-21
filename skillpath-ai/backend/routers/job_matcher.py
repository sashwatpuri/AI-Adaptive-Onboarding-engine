import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.job_matcher import (
    match_skills_to_jobs, 
    get_job_description,
    get_all_jobs,
    extract_skills_from_text
)

router = APIRouter()

class SkillMatchRequest(BaseModel):
    skills: List[str]
    session_id: str

class JobRequest(BaseModel):
    job_title: str

@router.post("/match-skills-to-jobs")
async def match_skills_to_jobs_endpoint(req: SkillMatchRequest):
    """Match extracted skills to available jobs from CSV"""
    start_time = time.time()
    try:
        matched_jobs = match_skills_to_jobs(req.skills)
        
        return {
            "skills": req.skills,
            "matched_jobs": matched_jobs,
            "session_id": req.session_id,
            "total_matches": len(matched_jobs),
            "ms": int((time.time() - start_time) * 1000)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/job-description")
async def get_job_desc(req: JobRequest):
    """Get detailed job description from CSV"""
    start_time = time.time()
    try:
        job_data = get_job_description(req.job_title)
        
        if not job_data:
            raise HTTPException(
                status_code=404, 
                detail=f"Job '{req.job_title}' not found"
            )
        
        # Extract skills from this job description
        skills_in_job = extract_skills_from_text(job_data["description"])
        
        return {
            **job_data,
            "required_skills": skills_in_job.get("skill_names", []),
            "ms": int((time.time() - start_time) * 1000)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/all-jobs")
async def list_all_jobs():
    """Get all available job titles from CSV"""
    start_time = time.time()
    try:
        jobs = get_all_jobs()
        
        return {
            "jobs": jobs,
            "total_jobs": len(jobs),
            "ms": int((time.time() - start_time) * 1000)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
