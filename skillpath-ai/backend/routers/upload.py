import uuid
import time
from pathlib import Path
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
        from sessions import sessions
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/random-dataset/{category}")
async def get_random_dataset_resume(category: str):
    start_time = time.time()
    try:
        import os
        import glob
        import random
        from services.pdf_parser import parse_pdf
        
        base_dir = Path(__file__).resolve().parents[3] / "datasets" / "resume_pdfs" / "data"
        if not base_dir.exists():
            # If the specific datasets folder is missing, try to find ANY PDFs in the repo for demo
            print(f"Warning: Datasets directory {base_dir} not found. Searching for any PDFs...")
            repo_root = Path(__file__).resolve().parents[3]
            import glob
            all_pdfs = glob.glob(str(repo_root / "**" / "*.pdf"), recursive=True)
            if not all_pdfs:
                raise HTTPException(status_code=404, detail="No resume PDFs found in the repository for random selection. Please upload a file manually.")
            safe_cat = "General"
        else:
            safe_cat = "".join(c for c in category if c.isalnum() or c in "-_ ").strip()
            cat_dir = base_dir / safe_cat
            
            if not cat_dir.is_dir():
                # Fallback to search if exact match fails
                dirs = [d for d in os.listdir(base_dir) if (base_dir / d).is_dir()]
                matched = False
                for d in dirs:
                    if category.lower() in d.lower():
                        cat_dir = base_dir / d
                        safe_cat = d
                        matched = True
                        break
                if not matched:
                    raise HTTPException(status_code=404, detail=f"Category '{safe_cat}' not found in dataset")
            
            all_pdfs = glob.glob(str(cat_dir / "**" / "*.pdf"), recursive=True)
            if not all_pdfs:
                raise HTTPException(status_code=404, detail=f"No PDFs found for category '{safe_cat}'")
            
        pdf_path = random.choice(all_pdfs)
        
        with open(pdf_path, 'rb') as f:
            pdf_bytes = f.read()
            
        parsed_resume = parse_pdf(pdf_bytes, os.path.basename(pdf_path))
        
        # We need a JD for the assessment - We can generate a generic one based on the category
        # Ensure we ask for relevant tech/soft skills.
        parsed_jd = f"Required experience for {safe_cat}: Minimum 3 years. We are looking for an expert in {safe_cat} who can handle core industry responsibilities, manage teams, and utilize standard industry software. The ideal candidate will have strong communication skills, advanced problem solving abilities, and deep domain knowledge. Also requires intermediate skill in Process Mapping and Leadership."

        session_id = str(uuid.uuid4())
        from sessions import sessions
        sessions[session_id] = {
            "resume_text": parsed_resume,
            "jd_text": parsed_jd,
            "trace": []
        }

        # Return the same shape as /upload
        return {
            "resume_text": parsed_resume,
            "jd_text": parsed_jd,
            "session_id": session_id,
            "filename": os.path.basename(pdf_path),
            "category": safe_cat,
            "ms": int((time.time() - start_time) * 1000)
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
