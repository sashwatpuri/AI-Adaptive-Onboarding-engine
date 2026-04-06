from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pathlib import Path

from services.tigergraph_service import tiger_service
from config import config

router = APIRouter(prefix="/api/tigergraph", tags=["TigerGraph"])

@APIRouter().get("/status")
def get_tigergraph_status():
    return {
        "enabled": config.ENABLE_TIGERGRAPH,
        "connected": tiger_service.conn is not None,
        "graph_name": config.TG_GRAPHNAME,
        "host": config.TG_HOST
    }

@APIRouter().post("/setup")
def setup_tigergraph_schema():
    if not config.ENABLE_TIGERGRAPH:
        raise HTTPException(status_code=400, detail="TigerGraph is not enabled in configuration.")
    return tiger_service.initialize_schema()

@APIRouter().post("/ingest")
def ingest_jobs_to_graph():
    if not config.ENABLE_TIGERGRAPH:
        raise HTTPException(status_code=400, detail="TigerGraph is not enabled in configuration.")
    csv_path = config.JOB_CSV_PATH
    return tiger_service.ingest_jobs_from_csv(csv_path)

@APIRouter().post("/match")
def match_skills_graph(skills: List[str]):
    if not config.ENABLE_TIGERGRAPH:
        raise HTTPException(status_code=400, detail="TigerGraph is not enabled in configuration.")
    return {"matched_jobs": tiger_service.match_skills_to_jobs(skills)}
