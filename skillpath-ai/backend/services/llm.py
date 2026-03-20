import google.generativeai as genai
import json, re
from config import config

genai.configure(api_key=config.GOOGLE_API_KEY)
model = genai.GenerativeModel(config.GEMINI_MODEL)

def call_llm(
  system_prompt: str,
  user_prompt: str,
  temperature: float = 0.1
) -> dict:
  
  full_prompt = f"{system_prompt}\n\n{user_prompt}"
  
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
    return json.loads(clean)
