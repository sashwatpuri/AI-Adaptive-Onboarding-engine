import uuid
import time
from fastapi import APIRouter, UploadFile, Form, File, HTTPException
from typing import Optional
from services.pdf_parser import parse_pdf

router = APIRouter()

@router.post("/upload")
async def upload_documents(
    resume: UploadFile = File(...),
    jd: Optional[UploadFile] = File(None),
    jd_text: Optional[str] = Form(None)
):
    start_time = time.time()
    try:
        resume_bytes = await resume.read()
        parsed_resume = parse_pdf(resume_bytes, resume.filename)

        parsed_jd = ""
        if jd:
            jd_bytes = await jd.read()
            parsed_jd = parse_pdf(jd_bytes, jd.filename)
        elif jd_text:
            parsed_jd = jd_text
        else:
            raise HTTPException(status_code=400, detail="Must provide JD file or text")

        session_id = str(uuid.uuid4())
        from main import sessions
        sessions[session_id] = {
            "resume_text": parsed_resume,
            "jd_text": parsed_jd,
            "trace": []
        }

        return {
            "resume_text": parsed_resume,
            "jd_text": parsed_jd,
            "session_id": session_id,
            "ms": int((time.time() - start_time) * 1000)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
