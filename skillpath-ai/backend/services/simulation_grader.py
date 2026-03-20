from services.llm import call_llm

GRADE_SYSTEM = """
You are an automated grader for practical assignments.
Grade the student's response based on the task description and evaluation criteria.
Provide constructive feedback and a score out of 3.
Return ONLY valid JSON:
{
  "score": 2,
  "correctness": "Good approach but failed edge cases",
  "missing": "Did not handle null values",
  "next_steps": "Review error handling",
  "feedback": "Overall solid start.",
  "roadmap_impact": "Proceed with minor review"
}
"""

def grade_simulation(task: dict, response_text: str) -> dict:
    prompt = f"Task: {task['title']}\nDescription: {task['description']}\nCriteria: {task.get('evaluation_criteria', [])}\n\nStudent Response:\n{response_text}"
    result = call_llm(GRADE_SYSTEM, prompt)
    return {
        "score": result.get("score", 0),
        "label": f"{result.get('score', 0)}/3",
        "feedback": result,
        "next_steps": result.get("next_steps", ""),
        "roadmap_impact": result.get("roadmap_impact", "")
    }
