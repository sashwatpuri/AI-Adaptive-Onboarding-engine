from typing import List
from pydantic import BaseModel

class Course(BaseModel):
    id: str
    title: str
    platform: str
    duration_hrs: int
    difficulty: str
    skills_covered: List[str]
    relevance_score: int = 0
    grounded: bool = True
    url: str = ""
    rating: float = 0.0
