import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()


def _resolve_path(value: str | None, default: Path) -> Path:
    if not value:
        return default

    raw = Path(value)
    if raw.is_absolute():
        return raw

    return (default.parent / raw).resolve()


class Config:
    BACKEND_DIR = Path(__file__).resolve().parent
    APP_DIR = BACKEND_DIR.parent
    REPO_ROOT = APP_DIR.parent

    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
    ENABLE_GEMINI = os.getenv("ENABLE_GEMINI", "0") == "1"
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    EMBED_MODEL = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")
    ENABLE_EMBEDDINGS = os.getenv("ENABLE_EMBEDDINGS", "0") == "1"
    CATALOG_PATH = _resolve_path(
        os.getenv("CATALOG_PATH"),
        BACKEND_DIR / "data" / "course_catalog.json",
    )
    TAXONOMY_PATH = _resolve_path(
        os.getenv("TAXONOMY_PATH"),
        BACKEND_DIR / "data" / "skill_taxonomy.json",
    )
    DATASET_ROOT = _resolve_path(
        os.getenv("DATASET_ROOT"),
        REPO_ROOT / "datasets" / "resume_pdfs" / "data",
    )
    JOB_CSV_PATH = _resolve_path(
        os.getenv("JOB_CSV_PATH"),
        REPO_ROOT / "job_title_des.csv",
    )
    MAX_MONTHS = int(os.getenv("MAX_MONTHS", 4))
    HOURS_PER_MONTH = int(os.getenv("HOURS_PER_MONTH", 18))
    REINFORCE_THRESHOLD = int(os.getenv("REINFORCE_THRESHOLD", 60))
    FAST_TRACK_THRESHOLD = int(os.getenv("FAST_TRACK_THRESHOLD", 80))
    MAX_RESUME_CHARS = int(os.getenv("MAX_RESUME_CHARS", 8000))

    # TigerGraph
    TG_HOST = os.getenv("TG_HOST", "")
    TG_GRAPHNAME = os.getenv("TG_GRAPHNAME", "SkillPath")
    TG_SECRET = os.getenv("TG_SECRET", "")
    TG_USERNAME = os.getenv("TG_USERNAME", "tigergraph")
    TG_PASSWORD = os.getenv("TG_PASSWORD", "")
    ENABLE_TIGERGRAPH = os.getenv("ENABLE_TIGERGRAPH", "0") == "1"


config = Config()
