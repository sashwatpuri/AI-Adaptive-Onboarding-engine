from typing import List, Dict
from pydantic import BaseModel
from .course import Course

class MonthPlan(BaseModel):
    month: int
    title: str
    skills: List[str]
    estimated_hours: int
    target_levels: Dict[str, str]
    courses: List[Course] = []
    status: str = "locked"
    has_simulation: bool = False
