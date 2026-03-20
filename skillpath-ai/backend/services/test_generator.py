from services.llm import call_llm

MCQ_SYSTEM = """
You are an expert technical interviewer.
Generate 8 multiple-choice questions testing these skills.
Return ONLY valid JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "What is Python's GIL?",
      "options": ["Global Interpreter Lock", "General Interface", "Graphic Layer", "Graph Index"],
      "correct_index": 0,
      "skill_tag": "Python",
      "type": "mcq",
      "explanation": "GIL is a mutex that protects access to Python objects."
    }
  ]
}
"""

SIM_SYSTEM = """
You are an expert code assessor.
Generate 1 hands-on simulation task (coding or scenario) for these skills.
Return ONLY valid JSON matching the SimulationTask model.
{
  "task_id": "sim_1",
  "type": "coding",
  "title": "Data Pipeline",
  "description": "Build a pipeline...",
  "starter_code": "def run():\\n  pass",
  "test_cases": [{"input": "A", "expected": "B"}],
  "context": "You are a data engineer...",
  "question": "Implement the logic.",
  "skill_tag": "Python",
  "evaluation_criteria": ["Correctness", "Performance"]
}
"""

def generate_month_test(skills: list, month: int, has_simulation: bool):
    skills_text = ", ".join(skills)
    mcq_result = call_llm(MCQ_SYSTEM, f"Skills: {skills_text}")
    questions = mcq_result.get("questions", [])
    
    simulation_task = None
    if has_simulation:
        sim_result = call_llm(SIM_SYSTEM, f"Skills: {skills_text}")
        if sim_result:
            simulation_task = sim_result
    
    return questions, simulation_task
