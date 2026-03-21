# 🎬 SkillPath AI — Video Walkthrough Script
## End-to-End User Journey Demo (2–3 Minutes)

> **Instructions**: Read the script below aloud while screen-recording the app. Timing cues are marked in brackets. Pause naturally at each screen transition.

---

## 🎙️ SPEAKING SCRIPT

### INTRO — Landing Page *(~15 seconds)*
> **[Show landing page at `localhost:5174`]**

*"Welcome to SkillPath AI — the Digital Oracle. This is an adaptive onboarding engine that eliminates what employees don't need to learn. Instead of a one-size-fits-all training program, SkillPath analyzes the gap between a candidate's current skills and the target role — then builds a hyper-personalized, month-by-month roadmap that continuously adapts based on performance."*

> **[Point to the two upload zones]**

*"Users can upload their resume and a target job description — or, for a quick demo, we can pull a random resume from a live Kaggle dataset."*

---

### STEP 1 — Trigger the Pipeline *(~10 seconds)*
> **[Click the "🚀 IT & Engineering" Live Dataset button]**

*"Let's trigger the live pipeline. I'll click IT & Engineering — this pulls a real resume from the dataset, runs it through our PDF parser, and sends both the resume and job description to Gemini for skill extraction."*

> **[Wait for loading animation to complete — show the "Digital Oracle Processing" spinner]**

*"The backend is now parsing the resume, extracting skills with confidence scores, analyzing gaps, and generating a custom roadmap — all in real time."*

---

### STEP 2 — Skill Extraction *(~20 seconds)*
> **[Skills page appears with extracted skill chips]**

*"Here's the Extracted Profiling screen. The AI has identified skills from the resume — each one tagged with a confidence percentage based on evidence found in the document. Skills are categorized into Technical, Soft Skills, and Domain Knowledge."*

> **[Hover over a skill chip to show the tooltip with evidence]**

*"If I hover over any skill, you can see the evidence — these are the exact phrases from the resume that justify the confidence score. Users can also manually remove skills they don't want considered."*

> **[Point to the sidebar stats panel — X skills detected]**

*"On the right, we see a summary: total skills detected, broken down by category. Let's proceed to the Gap Map."*

> **[Click "Proceed to Gap Map"]**

---

### STEP 3 — Skill Gap Map *(~20 seconds)*
> **[Gap Map page loads with visual analysis]**

*"This is the Skill Gap Map — the core intelligence of the system. Each skill is compared between its Current Level and Required Level for the target role. The AI assigns a severity: Critical, Moderate, Minor, or Covered."*

> **[Point to the Aggregate Gap Score]**

*"The aggregate readiness score tells us how prepared the candidate is right now. Skills marked as CRITICAL get priority in the learning roadmap."*

> **[Point to a CRITICAL skill and the AI Reasoning panel]**

*"Notice the AI Reasoning panel — it explains why the critical gap was flagged and what it means for the candidate's learning path."*

> **[Click "Generate Roadmap"]**

---

### STEP 4 — Adaptive Roadmap *(~25 seconds)*
> **[Roadmap page loads with month-by-month timeline]**

*"Here's the generated roadmap — a month-by-month learning path. Each month is a sprint with specific skills to develop, estimated hours, and curated course material."*

> **[Click Month 1 to expand]**

*"Month 1 is the Foundations Sprint. You can see the target skill levels and grounded course recommendations. These courses are pulled from a verified catalog using RAG retrieval — not hallucinated links."*

> **[Point to the "Grounded" badge on a course]**

*"Every course is tagged as 'Grounded' — meaning it comes from our curated catalog, not AI-generated URLs."*

> **[Click Month 2 to expand]**

*"Month 2 builds on Month 1 with more advanced skills. Notice how each month has a 'Take Month-End Test' button — this is where the adaptive engine kicks in."*

> **[Point to the radial chart — Overall Readiness]**

*"The sidebar shows the overall readiness percentage and current focus area."*

---

### STEP 5 — Sprint Assessment (Test Section) *(~30 seconds)*
> **[Click "Test" in the sidebar OR "Take Month-End Test" button]**

*"Now let's demonstrate the adaptive assessment. The system generates a month-specific test based on the skills in the current sprint."*

> **[Test page loads with questions]**

*"Here we have multiple-choice questions testing the skills from Month 1. Each question is tagged with the specific skill it's testing."*

> **[Answer questions — get some right, some deliberately wrong]**

*"I'll answer these questions — notice I'm intentionally getting some right and some wrong. This is the key: the system tracks per-skill accuracy."*

> **[Click "Submit Assessment"]**

*"Let's submit and see how the adaptive engine responds."*

> **[Results page appears with radial chart and skill breakdown]**

*"Look at the results. The Overall Competency is calculated, and each skill shows its individual score. Based on the overall performance:"*
- *"Score above **80%** → the system triggers a **FAST_TRACK** — mastered skills are removed from future months, accelerating the timeline."*
- *"Score between **60–80%** → **PROCEED** — the roadmap continues at the planned pace."*
- *"Score below **60%** → **REINFORCE** — weak skills are carried over to the next month, and extra practice material is inserted."*

*"This is the adaptive engine in action — the roadmap dynamically recalibrates based on actual performance, not just a fixed schedule."*

> **[Click "View Updated Roadmap" to return to the roadmap]**

---

### STEP 6 — Simulation Environment *(~15 seconds)*
> **[Click "Simulation" in the sidebar]**

*"Beyond multiple-choice tests, SkillPath includes a real-world simulation environment. There are two modes: a Coding Task with a live code editor, and a Business Scenario where users draft professional responses."*

> **[Show the coding challenge panel and code editor]**

*"The coding task presents a real problem — here, a Data Pipeline Aggregation challenge in Python. Users write code, run it, and then submit for AI grading."*

> **[Click the "Scenario" tab]**

*"The scenario tab presents a business challenge — users draft a response, and the AI evaluates clarity, prioritization, and practicality."*

---

### STEP 7 — AI Reasoning Trace *(~10 seconds)*
> **[Click "Reasoning" in the sidebar]**

*"Finally, the Reasoning Trace gives a transparent audit log of every decision the AI engine made — from skill placement to course selection to roadmap rerouting. Each decision shows a confidence percentage and the evidence that supported it. This is full AI transparency — no black box."*

---

### CLOSING *(~10 seconds)*

*"That's SkillPath AI — an end-to-end adaptive onboarding engine. It uses Gemini for skill extraction and test generation, RAG retrieval for grounded course recommendations, and a three-tier adaptive routing engine that Fast-Tracks, Proceeds, or Reinforces based on real assessment performance. The entire system is built with React, FastAPI, and a custom AI orchestration layer. Thank you for watching."*

---

## 📋 QUICK REFERENCE — Screen Flow

| # | Screen | Duration | Key Action |
|---|--------|----------|------------|
| 1 | Landing Page | 15s | Click "IT & Engineering" demo |
| 2 | Skill Extraction | 20s | Hover skills, then "Proceed to Gap Map" |
| 3 | Gap Map | 20s | Show severity, click "Generate Roadmap" |
| 4 | Roadmap | 25s | Expand months, show courses |
| 5 | Test / Assessment | 30s | Answer questions, submit, show adaptive results |
| 6 | Simulation | 15s | Show coding + scenario tabs |
| 7 | Reasoning Trace | 10s | Show transparent AI decisions |
| 8 | Closing | 10s | Summary wrap-up |
| | **TOTAL** | **~2:25** | |

---

## 🎯 KEY TALKING POINTS TO EMPHASIZE

1. **"We eliminate what they don't need to learn"** — Not generic training
2. **Adaptive Three-Tier Routing** — FAST_TRACK / PROCEED / REINFORCE based on scores
3. **Grounded Courses** — RAG-retrieved from verified catalog, not AI-hallucinated URLs
4. **AI Transparency** — Full reasoning trace with evidence and confidence scores
5. **Real-Time Pipeline** — PDF parsing → Skill extraction → Gap analysis → Roadmap → Test → Reroute
6. **Gemini-Powered** — Uses Google's Gemini for LLM tasks with deterministic fallbacks

## 🎥 RECORDING TIPS

- **Screen resolution**: 1920×1080 recommended
- **Browser**: Chrome, maximized, with DevTools closed
- **Speak slowly** at transitions — let the UI animations play out
- **Hover over elements** to trigger tooltips (especially on skill chips)
- **For the test**: Answer 4/6 correct to demonstrate "PROCEED" status, or 2/6 to show "REINFORCE"
- **Record with OBS or Loom** for best quality

## 📹 RECORDED BROWSER WALKTHROUGH VIDEOS

The following browser recordings were captured during testing:

| Recording |  Description |
|-----------|-----------|
| [Landing Page](file:///C:/Users/Divyansh%20Bhatt/.gemini/antigravity/brain/9178975b-d248-4771-ac36-eb1ecc640836/landing_page_view_1774128417424.webp) | Landing page overview |
| [Full Pipeline Demo](file:///C:/Users/Divyansh%20Bhatt/.gemini/antigravity/brain/9178975b-d248-4771-ac36-eb1ecc640836/demo_it_pipeline_1774128478977.webp) | IT & Engineering pipeline through Skills → Gap → Roadmap → Test |
| [Test Answer & Submit](file:///C:/Users/Divyansh%20Bhatt/.gemini/antigravity/brain/9178975b-d248-4771-ac36-eb1ecc640836/test_answer_submit_1774128627115.webp) | Answering test questions and viewing adaptive results |
| [Simulation & Reasoning](file:///C:/Users/Divyansh%20Bhatt/.gemini/antigravity/brain/9178975b-d248-4771-ac36-eb1ecc640836/simulation_reasoning_view_1774128832151.webp) | Simulation environment and Reasoning Trace pages |
| [Test Fix Verification](file:///C:/Users/Divyansh%20Bhatt/.gemini/antigravity/brain/9178975b-d248-4771-ac36-eb1ecc640836/verify_test_fix_1774129867670.webp) | Verified test section works with active sessions |
