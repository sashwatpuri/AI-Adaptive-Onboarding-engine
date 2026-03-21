from typing import List
from models.skill import ResumeSkill, JDSkill
from services.job_matcher import extract_skills_from_text, match_skills_to_jobs
from services.reasoning_tracer import log_reasoning
from config import config

async def extract_resume_skills(text: str, session_id: str) -> List[ResumeSkill]:
    """Extract skills from resume using trained model instead of LLM API"""
    print(f"Extracting skills from resume (session: {session_id})")
    
    # Extract skills using the trained model
    extraction_result = extract_skills_from_text(text)
    skills = extraction_result.get("skills", [])
    
    # Add level (since we don't have detailed extraction, use medium level)
    validated = []
    for skill_data in skills:
        validated.append({
            "skill": skill_data["skill"],
            "level": "Intermediate",
            "confidence": skill_data.get("confidence", 80),
            "evidence": [f"Found in resume text using {skill_data.get('found_by', 'pattern')} matching"],
            "category": "Technical" if "Communication" not in skill_data["skill"] and "Leadership" not in skill_data["skill"] and "Team" not in skill_data["skill"] else "Soft Skills"
        })
    
    # Log to reasoning trace
    log_reasoning(session_id, {
        "type": "SKILL_EXTRACTION",
        "summary": f"Extracted {len(validated)} skills from resume",
        "reasoning": "Skills extracted using trained job matcher model with pattern matching and semantic similarity",
        "evidence": [
            f"Skills found: {[s['skill'] for s in validated]}",
            f"Model: Job Matcher (no API calls)",
            f"Method: Combined keyword matching and semantic embeddings"
        ],
        "confidence": 85
    })
    
    return [ResumeSkill(**s) for s in validated]

async def extract_jd_skills(text: str, session_id: str) -> List[JDSkill]:
    """Extract required skills from job description using trained model"""
    print(f"Extracting skills from JD (session: {session_id})")
    
    # Extract skills using the trained model
    extraction_result = extract_skills_from_text(text)
    skills = extraction_result.get("skills", [])
    
    # Find what jobs match these skills to determine criticality
    matched_jobs = match_skills_to_jobs(extraction_result.get("skill_names", []))
    
    validated = []
    for skill_data in skills:
        skill_name = skill_data["skill"]
        
        # Determine if skill is critical based on frequency in matched jobs
        frequency = sum(
            1 for job in matched_jobs 
            if skill_name in job.get("matching_skills", [])
        )
        is_critical = frequency > 2 or len(matched_jobs) == 0
        
        validated.append({
            "skill": skill_name,
            "level_required": "Intermediate",
            "is_critical": is_critical,
            "frequency": frequency
        })
    
    # Log to reasoning trace
    log_reasoning(session_id, {
        "type": "JD_SKILL_EXTRACTION",
        "summary": f"Extracted {len(validated)} required skills from JD",
        "reasoning": "Skills extracted from JD using trained model and matched against job database",
        "evidence": [
            f"Skills found: {[s['skill'] for s in validated]}",
            f"Critical skills: {[s['skill'] for s in validated if s['is_critical']]}",
            f"Matched to {len(matched_jobs)} job positions"
        ],
        "confidence": 80
    })
    
    return [JDSkill(**s) for s in validated]
