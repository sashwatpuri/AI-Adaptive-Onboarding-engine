from services.llm import call_llm

QUESTION_BANK = {
    "python": {
        "question": "Which Python data type is best for unique unordered values?",
        "options": ["List", "Tuple", "Set", "String"],
        "correct_index": 2,
        "explanation": "Sets store unique values without preserving order.",
    },
    "sql": {
        "question": "Which SQL clause is used to filter grouped results?",
        "options": ["WHERE", "HAVING", "ORDER BY", "LIMIT"],
        "correct_index": 1,
        "explanation": "HAVING filters results after aggregation.",
    },
    "javascript": {
        "question": "Which keyword declares a block-scoped variable in JavaScript?",
        "options": ["var", "let", "global", "constvar"],
        "correct_index": 1,
        "explanation": "let creates a block-scoped variable.",
    },
    "react": {
        "question": "What is React state primarily used for?",
        "options": ["Styling CSS", "Routing only", "Tracking UI data over time", "Bundling assets"],
        "correct_index": 2,
        "explanation": "State stores data that affects rendering.",
    },
    "docker": {
        "question": "What is the main purpose of a Docker image?",
        "options": ["Monitor logs", "Package an application and dependencies", "Store secrets", "Replace version control"],
        "correct_index": 1,
        "explanation": "Images package the app and everything needed to run it.",
    },
    "aws": {
        "question": "Which AWS service is commonly used for object storage?",
        "options": ["EC2", "S3", "RDS", "Lambda"],
        "correct_index": 1,
        "explanation": "Amazon S3 is AWS object storage.",
    },
}

GENERIC_QUESTIONS = [
    {
        "question": "What is the best first step when requirements are ambiguous?",
        "options": ["Code immediately", "Clarify expected outcomes", "Ignore edge cases", "Skip validation"],
        "correct_index": 1,
        "explanation": "Clarifying outcomes reduces rework and defects.",
    },
    {
        "question": "Which practice most improves maintainability?",
        "options": ["Long functions", "Hardcoded values", "Readable modular code", "Skipping tests"],
        "correct_index": 2,
        "explanation": "Readable modular code is easier to change safely.",
    },
]


def _fallback_questions(skills: list) -> list:
    questions = []
    index = 1

    for skill in skills:
        template = QUESTION_BANK.get(skill.lower())
        if not template:
            continue

        questions.append(
            {
                "id": f"q{index}",
                "question": template["question"],
                "options": template["options"],
                "correct_index": template["correct_index"],
                "skill_tag": skill,
                "type": "mcq",
                "explanation": template["explanation"],
            }
        )
        index += 1

    while len(questions) < 6:
        template = GENERIC_QUESTIONS[(len(questions) - len(skills)) % len(GENERIC_QUESTIONS)]
        questions.append(
            {
                "id": f"q{index}",
                "question": template["question"],
                "options": template["options"],
                "correct_index": template["correct_index"],
                "skill_tag": skills[0] if skills else "General",
                "type": "mcq",
                "explanation": template["explanation"],
            }
        )
        index += 1

    return questions


def _fallback_simulation(skills: list, month: int) -> dict:
    primary_skill = skills[0] if skills else "Problem Solving"
    technical = {"python", "sql", "javascript", "react", "docker", "aws", "java"}
    is_coding = primary_skill.lower() in technical

    if is_coding:
        return {
            "task_id": f"sim_{month}",
            "type": "coding",
            "title": f"{primary_skill} Practice Task",
            "description": f"Write a concise solution that demonstrates practical {primary_skill} knowledge.",
            "starter_code": "def solve(data):\n    return data",
            "test_cases": [{"input": "sample", "expected": "sample"}],
            "context": f"You are completing a month {month} checkpoint for {primary_skill}.",
            "question": f"Implement a small {primary_skill} solution and explain tradeoffs in comments if needed.",
            "skill_tag": primary_skill,
            "evaluation_criteria": ["Correctness", "Clarity", "Coverage"],
        }

    return {
        "task_id": f"sim_{month}",
        "type": "scenario",
        "title": f"{primary_skill} Scenario Exercise",
        "description": f"Draft a response that demonstrates applied {primary_skill}.",
        "starter_code": "",
        "test_cases": [],
        "context": f"You are resolving a realistic month {month} work scenario.",
        "question": f"Write a short action plan that shows competence in {primary_skill}.",
        "skill_tag": primary_skill,
        "evaluation_criteria": ["Clarity", "Prioritization", "Practicality"],
    }


def generate_month_test(skills: list, month: int, has_simulation: bool):
    skills = skills or ["General"]
    skills_text = ", ".join(skills)

    mcq_result = call_llm(
        """
You are an expert technical interviewer.
Generate 8 multiple-choice questions testing these skills.
Each question MUST have: "id" (string), "question", "options" (list of 4 strings), "correct_index" (0-3), and "skill_tag".
Return ONLY valid JSON with a `questions` array.
""",
        f"Skills: {skills_text}",
    )
    questions = mcq_result.get("questions", [])
    if not questions:
        questions = _fallback_questions(skills)
    else:
        # Ensure every question has an id and skill_tag
        for i, q in enumerate(questions):
            if "id" not in q:
                q["id"] = f"llm_q_{i}_{month}"
            if "skill_tag" not in q:
                q["skill_tag"] = skills[0] if skills else "General"

    simulation_task = None
    if has_simulation:
        sim_result = call_llm(
            """
You are an expert code assessor.
Generate 1 hands-on simulation task for these skills.
Return ONLY valid JSON matching the expected simulation task shape.
""",
            f"Skills: {skills_text}",
        )
        simulation_task = sim_result or _fallback_simulation(skills, month)

    return questions, simulation_task
