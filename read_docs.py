import sys
import docx
import os

# Set stdout to use utf-8
sys.stdout.reconfigure(encoding='utf-8')

def search_docx(file_path, query):
    if not os.path.exists(file_path):
        return f"File {file_path} not found."
    doc = docx.Document(file_path)
    matches = []
    for i, para in enumerate(doc.paragraphs):
        if query.lower() in para.text.lower():
            matches.append(f"Line {i}: {para.text}")
    return matches

query = "TigerGraph"
print(f"--- Searching for '{query}' in SkillPath_TechStack.docx ---")
matches1 = search_docx('d:/my course/Projects/AI-Adaptive-Onboarding-engine/SkillPath_TechStack.docx', query)
for m in matches1: print(m)

print(f"\n--- Searching for '{query}' in SkillPath_AI_DesignDoc.docx ---")
matches2 = search_docx('d:/my course/Projects/AI-Adaptive-Onboarding-engine/SkillPath_AI_DesignDoc.docx', query)
for m in matches2: print(m)

print(f"\n--- Searching for '{query}' in SkillPath_AI_PRD.docx ---")
matches3 = search_docx('d:/my course/Projects/AI-Adaptive-Onboarding-engine/SkillPath_AI_PRD.docx', query)
for m in matches3: print(m)
