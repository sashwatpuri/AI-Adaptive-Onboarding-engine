# SkillPath AI

SkillPath AI is a fully autonomous, multi-agent AI engine that eliminates corporate training bloat. It takes a user's resume and a target job description, extracts exact skills, builds a dependency-aware gap map, curates real-world grounded courses, administers month-end adaptive tests, and hosts interactive coding/business simulations.

All orchestration is powered by Google Gemini (via `google-genai`).

## Project Structure

- `/backend`: FastAPI Python server containing the 4-agent LLM orchestration engine.
- `/frontend`: React + Vite + Tailwind frontend featuring the "Digital Oracle" design system.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create virtual environment: `python -m wenv venv` or `python -m venv venv`
3. Activate virtual environment: `.\venv\Scripts\activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Create a `.env` file in the `backend` folder and add your Google Gemini API key:
   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```
6. Generate the mock course catalog (only needed once): `python generate_catalog.py`
7. Start the backend server: `uvicorn main:app --reload`
   * The server runs on `http://localhost:8000`

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
   * The application runs on `http://localhost:5173`

*(Note: The frontend is configured to proxy `/api` requests to `http://localhost:8000` automatically).*

## Demo Scenarios
If you don't want to wait for the LLM to parse a large PDF during a live demo, the Landing screen includes two "Instant Demo" buttons (ML Engineer and Ops Manager). These instantly load pre-computed JSON states into the frontend store so you can explore all 8 un-siloed screens immediately.
