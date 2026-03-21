from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import threading
from services.rag_retriever import build_index

# In-memory session store (shared across routers)
sessions = {}

from routers import (upload, skills, roadmap, 
  courses, test, simulation, reasoning, job_matcher)

def _build_index_bg():
  print("Building RAG index in background...")
  try:
    build_index()
    print("RAG index built successfully")
  except Exception as e:
    print(f"Error building RAG index: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
  print("Starting SkillPath AI server...")
  # Build index in background thread so server can start immediately
  thread = threading.Thread(target=_build_index_bg, daemon=True)
  thread.start()
  yield

app = FastAPI(
  title="SkillPath AI",
  version="1.0.0",
  lifespan=lifespan
)

app.add_middleware(CORSMiddleware,
  allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"])

app.include_router(upload.router,     prefix="/api")
app.include_router(skills.router,     prefix="/api")
app.include_router(roadmap.router,    prefix="/api")
app.include_router(courses.router,    prefix="/api")
app.include_router(job_matcher.router, prefix="/api")
app.include_router(test.router,       prefix="/api")
app.include_router(simulation.router, prefix="/api")
app.include_router(reasoning.router,  prefix="/api")
