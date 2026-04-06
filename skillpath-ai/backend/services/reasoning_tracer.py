from datetime import datetime

def log_reasoning(session_id: str, entry: dict):
    from sessions import sessions
    if session_id not in sessions:
        sessions[session_id] = {"trace": []}
    if "trace" not in sessions[session_id]:
        sessions[session_id]["trace"] = []
    
    sessions[session_id]["trace"].append({
        **entry,
        "timestamp": datetime.utcnow().isoformat()
    })

def get_trace(session_id: str) -> list:
    from sessions import sessions
    return sessions.get(session_id, {}).get("trace", [])
