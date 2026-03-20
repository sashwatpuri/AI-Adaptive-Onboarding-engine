from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from services.rag_retriever import build_index

# In-memory session store (shared across routers)
sessions = {}

from routers import (upload, skills, roadmap, 
  courses, test, simulation, reasoning)

@asynccontextmanager
async def lifespan(app: FastAPI):
  print("Building RAG index...")
  build_index()
  print("Warming up API connection...")
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
app.include_router(test.router,       prefix="/api")
app.include_router(simulation.router, prefix="/api")
app.include_router(reasoning.router,  prefix="/api")
