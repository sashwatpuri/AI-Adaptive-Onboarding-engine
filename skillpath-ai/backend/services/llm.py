import json
import re

from config import config

if config.ENABLE_GEMINI:
  try:
    import google.generativeai as genai
  except Exception:
    genai = None
else:
  genai = None

model = None
if genai and config.ENABLE_GEMINI and config.GOOGLE_API_KEY:
  try:
    genai.configure(api_key=config.GOOGLE_API_KEY)
    model = genai.GenerativeModel(config.GEMINI_MODEL)
  except Exception:
    model = None


def _extract_skills(user_prompt: str) -> list:
  marker = "Skills:"
  if marker not in user_prompt:
    return ["General"]
  skills_text = user_prompt.split(marker, 1)[1]
  return [item.strip() for item in skills_text.split(",") if item.strip()] or ["General"]


def _fallback_response(system_prompt: str, user_prompt: str) -> dict:
  system_lower = system_prompt.lower()

  if "multiple-choice questions" in system_lower:
    skills = _extract_skills(user_prompt)
    questions = []
    idx = 1

    # Generate 2 questions per skill
    for skill in skills[:8]:
      questions.append({
        "id": f"q{idx}",
        "question": f"What is a core best practice when working with {skill}?",
        "options": [
          f"Validate inputs and structure your {skill} workflow",
          "Skip testing to save time",
          "Ignore error handling",
          "Avoid documenting the solution"
        ],
        "correct_index": 0,
        "skill_tag": skill,
        "type": "mcq",
        "explanation": f"Reliable {skill} work depends on validation, testing, and maintainable structure."
      })
      idx += 1
      questions.append({
        "id": f"q{idx}",
        "question": f"What is the most effective way to improve your {skill} proficiency?",
        "options": [
          "Only read documentation without practicing",
          f"Build real projects that apply {skill} concepts",
          "Memorize syntax without understanding concepts",
          "Avoid peer code reviews"
        ],
        "correct_index": 1,
        "skill_tag": skill,
        "type": "mcq",
        "explanation": f"Hands-on projects are the most effective way to deepen {skill} understanding."
      })
      idx += 1

    # Pad to at least 6 questions with generic ones
    generic_qs = [
      {"question": "What is the best first step when requirements are ambiguous?",
       "options": ["Code immediately", "Clarify expected outcomes", "Ignore edge cases", "Skip validation"],
       "correct_index": 1, "explanation": "Clarifying outcomes reduces rework and defects."},
      {"question": "Which practice most improves maintainability?",
       "options": ["Long functions", "Hardcoded values", "Readable modular code", "Skipping tests"],
       "correct_index": 2, "explanation": "Readable modular code is easier to change safely."},
      {"question": "What helps most when debugging a complex issue?",
       "options": ["Randomly changing code", "Systematic elimination of causes", "Ignoring error messages", "Restarting the project"],
       "correct_index": 1, "explanation": "Systematic debugging isolates the root cause efficiently."},
    ]
    gi = 0
    while len(questions) < 6:
      g = generic_qs[gi % len(generic_qs)]
      questions.append({
        "id": f"q{idx}", "question": g["question"], "options": g["options"],
        "correct_index": g["correct_index"],
        "skill_tag": skills[0] if skills else "General",
        "type": "mcq", "explanation": g["explanation"]
      })
      idx += 1
      gi += 1
    return {"questions": questions}

  if "hands-on simulation task" in system_lower:
    skills = _extract_skills(user_prompt)
    primary_skill = skills[0] if skills else "General"
    return {
      "task_id": "sim_1",
      "type": "coding",
      "title": f"{primary_skill} Implementation Exercise",
      "description": f"Build a small solution that demonstrates practical {primary_skill} proficiency.",
      "starter_code": "def run(data):\n    return data\n",
      "test_cases": [{"input": "sample", "expected": "sample"}],
      "context": "You are completing a practical checkpoint for the current roadmap month.",
      "question": f"Implement a clean, tested solution using {primary_skill}.",
      "skill_tag": primary_skill,
      "evaluation_criteria": ["Correctness", "Clarity", "Edge-case handling"]
    }

  if "automated grader" in system_lower:
    response_len = len(user_prompt.strip())
    score = 3 if response_len > 200 else 2 if response_len > 60 else 1
    return {
      "score": score,
      "correctness": "Response covered the main task requirements.",
      "missing": "" if score >= 2 else "Add more implementation detail and edge-case handling.",
      "next_steps": "Review the weaker concepts and retry one similar exercise.",
      "feedback": "Fallback grader used because the LLM service was unavailable.",
      "roadmap_impact": "Proceed with review" if score >= 2 else "Reinforce this skill next month"
    }

  if "course recommendation engine" in system_lower:
    try:
      courses_json = user_prompt.split("Courses:\n", 1)[1]
      candidates = json.loads(courses_json)
    except Exception:
      candidates = []
    return {
      "recommendations": [
        {
          "id": candidate.get("id", ""),
          "rank_reason": "Strong direct skill overlap and a reasonable learning progression."
        }
        for candidate in candidates[:3]
      ]
    }

  return {}


def call_llm(
  system_prompt: str,
  user_prompt: str,
  temperature: float = 0.1
) -> dict:
  if not config.ENABLE_GEMINI or model is None:
    return _fallback_response(system_prompt, user_prompt)

  full_prompt = f"{system_prompt}\n\n{user_prompt}"

  try:
    response = model.generate_content(
      full_prompt,
      generation_config=genai.GenerationConfig(
        temperature=temperature,
        response_mime_type="application/json"
      )
    )

    raw = response.text

    try:
      return json.loads(raw)
    except json.JSONDecodeError:
      clean = re.sub(r'```json|```', '', raw).strip()
      try:
        return json.loads(clean)
      except json.JSONDecodeError:
        return _fallback_response(system_prompt, user_prompt)
  except Exception as e:
    print(f"LLM fallback engaged: {e}")
    return _fallback_response(system_prompt, user_prompt)
