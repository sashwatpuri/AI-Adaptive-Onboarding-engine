from enum import Enum
from typing import List
from pydantic import BaseModel

class SkillLevel(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"

class ResumeSkill(BaseModel):
    skill: str
    level: SkillLevel
    confidence: int  # 0-100
    evidence: List[str] = []
    category: str = "Technical"

class JDSkill(BaseModel):
    skill: str
    level_required: SkillLevel
    is_critical: bool = True
    frequency: int = 1

class GapSkill(BaseModel):
    skill: str
    current_level: int  # 0-3
    required_level: int  # 1-3
    gap_score: int       # 0-3
    severity: str        # COVERED/MINOR/MODERATE/CRITICAL
