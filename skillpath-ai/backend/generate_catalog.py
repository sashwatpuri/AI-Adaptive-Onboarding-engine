import json
import os
import random

categories = {
    "Python": 10, "SQL": 6, "JavaScript/React": 8,
    "Machine Learning": 10, "Deep Learning/PyTorch": 8,
    "Data Engineering": 6, "MLOps/Docker": 6,
    "Statistics/Math": 6, "System Design": 5,
    "FastAPI/Backend": 5, "Cloud AWS/GCP": 5,
    "Project Management": 5, "Communication": 5,
    "Operations/Logistics": 5, "Leadership": 5
}

platforms = ["Coursera", "Udacity", "edX", "Pluralsight", "LinkedIn Learning"]
difficulties = ["Beginner", "Intermediate", "Advanced"]

courses = []
c_id = 1

for cat, count in categories.items():
    for _ in range(count):
        course = {
            "id": f"course_{c_id:03d}",
            "title": f"{cat} Mastery: Course {_ + 1}",
            "platform": random.choice(platforms),
            "duration_hrs": random.randint(5, 40),
            "difficulty": random.choice(difficulties),
            "skills_covered": [cat] + random.sample([cat.split('/')[0], "Fundamentals", "Analysis", "Development"], 2),
            "description": f"Comprehensive {cat} course covering from basics to advanced.",
            "rating": round(random.uniform(4.0, 5.0), 1),
            "free": random.choice([True, False]),
            "url": f"https://example.com/course_{c_id:03d}"
        }
        courses.append(course)
        c_id += 1

output = {
    "courses": courses
}

os.makedirs(r"c:\Users\Parth Bhoyar\OneDrive\Desktop\Hackathon1\skillpath-ai\backend\data", exist_ok=True)
with open(r"c:\Users\Parth Bhoyar\OneDrive\Desktop\Hackathon1\skillpath-ai\backend\data\course_catalog.json", "w") as f:
    json.dump(output, f, indent=2)
with open(r"c:\Users\Parth Bhoyar\OneDrive\Desktop\Hackathon1\skillpath-ai\backend\data\skill_taxonomy.json", "w") as f:
    json.dump({}, f)

print("Catalog generated.")
