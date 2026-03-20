import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    EMBED_MODEL = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")
    CATALOG_PATH = os.getenv("CATALOG_PATH", "data/course_catalog.json")
    TAXONOMY_PATH = os.getenv("TAXONOMY_PATH", "data/skill_taxonomy.json")
    MAX_MONTHS = int(os.getenv("MAX_MONTHS", 4))
    HOURS_PER_MONTH = int(os.getenv("HOURS_PER_MONTH", 18))
    REINFORCE_THRESHOLD = int(os.getenv("REINFORCE_THRESHOLD", 60))
    FAST_TRACK_THRESHOLD = int(os.getenv("FAST_TRACK_THRESHOLD", 80))
    MAX_RESUME_CHARS = int(os.getenv("MAX_RESUME_CHARS", 8000))

config = Config()
