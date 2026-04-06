# SkillPath AI

SkillPath AI is an AI-powered career guidance and upskilling project. It analyzes resumes and job descriptions, extracts skills, identifies gaps, recommends learning paths, and supports simulations, testing, and reasoning flows through a full-stack application.

This repository contains the main app, supporting datasets, design explorations, and implementation notes used during development.

## Repository Structure

- `skillpath-ai/`: Main application
- `skillpath-ai/backend/`: FastAPI backend
- `skillpath-ai/frontend/`: React + Vite frontend
- `datasets/`: Resume datasets and supporting data files
- `docs/`: Product and design documentation
- `stitch_design/`: UI exploration assets and prototypes
- `job_title_des.csv`: Job-title and description dataset used for matching
- `IMPLEMENTATION_GUIDE.md`: Detailed notes for the local skill-to-job matching flow
- `QUICK_REFERENCE.md`: Short setup and usage reference

## Features

- Resume and job description parsing
- Skill extraction and gap analysis
- Job matching from local dataset files
- Learning roadmap generation
- Course recommendation flow
- TigerGraph integration for relational skill matching
- Adaptive test and simulation support
- Reasoning and trace visibility in the UI

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Zustand, Recharts
- Backend: FastAPI, Pydantic, Uvicorn, pyTigerGraph
- AI / NLP: sentence-transformers, FAISS, Google Gemini integration
- Database: TigerGraph (Graph-based matching)
- Data processing: pandas, numpy, PyMuPDF, pdfplumber, python-docx

## Getting Started

### One-Click Start (Windows)

For the easiest experience, use the new automated startup script:

- **Launch all:** Double-click `Start_App.bat`. This automatically handles dependencies, model training, and launches both services.
- **Stop App:** Simply close the terminal windows that open.

### Manual Setup (Prerequisites)

- Python 3.10+
- Node.js 18+
- npm

### 1. Start the Backend

```bash
cd skillpath-ai/backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `skillpath-ai/backend` and add:

```env
GOOGLE_API_KEY=your_api_key_here
```

Generate the local course catalog if needed:

```bash
python generate_catalog.py
```

Run the API server:

```bash
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`.

### 2. Start the Frontend

```bash
cd skillpath-ai/frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Project Notes

- The frontend is configured to work with the backend on `localhost:8000`.
- The backend builds some retrieval/indexing data on startup in the background.
- Additional implementation details for local job matching are documented in `IMPLEMENTATION_GUIDE.md`.
- The main app already includes a more app-specific README at `skillpath-ai/README.md`.

## Available Backend Routes

The backend includes route groups for:

- Upload
- Skills
- Roadmap
- Courses
- Job matcher
- Test
- Simulation
- Reasoning

## Demo Assets

The frontend includes demo JSON files under `skillpath-ai/frontend/public/demos/` for faster walkthroughs without a full live upload flow.

## Documentation

- `skillpath-ai/README.md`
- `IMPLEMENTATION_GUIDE.md`
- `QUICK_REFERENCE.md`
- `SETUP_COMPLETE.md`
- `skillpath-ai/backend/SKILL_MATCHING.md`

## License

Add your preferred license here.
