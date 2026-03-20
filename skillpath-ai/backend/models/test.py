from typing import List, Dict
from pydantic import BaseModel

class Question(BaseModel):
    id: str
    question: str
    options: List[str]
    correct_index: int
    skill_tag: str
    type: str = "mcq"
    explanation: str = ""

class SimulationTask(BaseModel):
    task_id: str
    type: str  # "coding" or "scenario"
    title: str
    description: str
    starter_code: str = ""
    test_cases: List[Dict] = []
    context: str = ""
    question: str = ""
    skill_tag: str
    evaluation_criteria: List[str] = []
