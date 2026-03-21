from typing import List
from pydantic import BaseModel

class Course(BaseModel):
    id: str
    title: str
    platform: str
    duration_hrs: int
    difficulty: str
    description: str = ""
    rating: float = 0.0
    free: bool = False
