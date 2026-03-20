import time
from fastapi import APIRouter, HTTPException
from services.reasoning_tracer import get_trace

router = APIRouter()

@router.get("/reasoning-trace/{session_id}")
async def fetch_trace(session_id: str):
    start_time = time.time()
    try:
        trace = get_trace(session_id)
        return {
            "decisions": trace,
            "session_id": session_id,
            "ms": int((time.time() - start_time) * 1000)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
