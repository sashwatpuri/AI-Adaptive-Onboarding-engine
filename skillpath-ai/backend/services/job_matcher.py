from pathlib import Path
import os

import numpy as np
import pandas as pd

from config import config

SKILL_KEYWORDS = {
    "Python": ["python", "py"],
    "Java": ["java"],
    "C++": ["c++", "cpp"],
    "C": ["\bc\b"],
    "JavaScript": ["javascript", "js", "nodejs", "node.js"],
    "TypeScript": ["typescript", "ts"],
    "React": ["react", "reactjs"],
    "Angular": ["angular", "angularjs"],
    "Vue": ["vue", "vuejs"],
    "HTML/CSS": ["html", "css", "tailwind", "sass", "less"],
    "Django": ["django"],
    "Flask": ["flask"],
    "FastAPI": ["fastapi"],
    "REST API": ["rest api", "rest", "api", "restful"],
    "SQL": ["sql", "mysql", "postgresql", "oracle", "database", "sqlite"],
    "NoSQL": ["mongodb", "mongo", "nosql", "redis", "cassandra"],
    "Machine Learning": ["machine learning", "ml", "deep learning", "neural network", "model evaluation"],
    "Computer Vision": ["computer vision", "opencv", "image processing", "image classification"],
    "NLP": ["nlp", "natural language processing", "llm", "large language model"],
    "PyTorch": ["pytorch"],
    "TensorFlow": ["tensorflow", "keras"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "Data Science": ["data science", "data scientist", "data analysis", "data analytics", "data preprocessing"],
    "Matplotlib": ["matplotlib", "seaborn", "visualization", "plotting"],
    "Docker": ["docker", "containerization", "container"],
    "Kubernetes": ["kubernetes", "k8s"],
    "AWS": ["aws", "amazon web services", "ec2", "s3", "lambda", "eks", "ecs"],
    "GCP": ["gcp", "google cloud", "gke"],
    "Azure": ["azure", "microsoft azure", "aks"],
    "Terraform": ["terraform", "infrastructure as code", "iac", "terragrunt"],
    "CI/CD": ["ci/cd", "cicd", "continuous integration", "continuous deployment", "continuous delivery", "pipeline", "jenkins", "github actions", "gitlab ci", "circleci", "travis"],
    "Ansible": ["ansible", "configuration management"],
    "Helm": ["helm", "helm chart"],
    "Prometheus": ["prometheus", "grafana", "monitoring", "observability", "alerting"],
    "Kafka": ["kafka", "message queue", "event streaming", "rabbitmq", "pub/sub"],
    "Spark": ["spark", "apache spark", "pyspark", "big data"],
    "Airflow": ["airflow", "apache airflow", "workflow orchestration", "dag"],
    "Spring Boot": ["spring boot", "spring", "spring framework", "java backend"],
    "Microservices": ["microservices", "microservice", "service mesh", "istio"],
    "GraphQL": ["graphql", "graph ql"],
    "gRPC": ["grpc", "protocol buffers", "protobuf"],
    "Git": ["git", "version control", "github", "gitlab", "bitbucket"],
    "Linux": ["linux", "unix", "ubuntu", "debian", "centos", "bash", "shell scripting"],
    "IoT": ["iot", "internet of things", "sensor", "arduino", "raspberry pi", "esp32", "hardware integration"],
    "Communication": ["communication", "interpersonal", "verbal", "written", "presentation"],
    "Leadership": ["leadership", "leader", "manage", "management", "mentoring"],
    "Problem Solving": ["problem solving", "analytical", "critical thinking", "troubleshooting"],
    "Team Work": ["teamwork", "collaboration", "team player", "collaborative"],
    "Time Management": ["time management", "organization", "prioritization", "organisational"],
    "Agile": ["agile", "scrum", "sprint", "kanban", "jira"],
    "Flutter": ["flutter"],
    "Kotlin": ["kotlin"],
    "Swift": ["swift"],
    "Golang": ["golang", "go lang", "go programming"],
    "Rust": ["rust", "rust lang"],
    "Redis": ["redis", "caching", "in-memory"],
    "Elasticsearch": ["elasticsearch", "elastic search", "opensearch", "kibana", "elk"],
    "Networking": ["networking", "tcp/ip", "dns", "load balancing", "cdn", "vpn", "firewall"],
    "Security": ["security", "cybersecurity", "devsecops", "iam", "oauth", "jwt", "ssl", "tls", "penetration testing"],
    "Testing": ["testing", "unit testing", "integration testing", "pytest", "junit", "selenium", "tdd", "bdd"],
}

_model = None
_job_embeddings = None
_jobs_data = None
_initialized = False
_semantic_enabled = os.getenv("ENABLE_SEMANTIC_JOB_MATCHER", "").lower() == "true"


def _empty_jobs_frame():
    return pd.DataFrame({"Job Title": [], "Job Description": []})


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[3]


def _score_keyword_match(skill_name: str, haystack: str) -> int:
    text = haystack.lower()
    score = 0
    for keyword in SKILL_KEYWORDS.get(skill_name, [skill_name.lower()]):
        if keyword in text:
            score += 1
    return score


def initialize_job_matcher():
    global _model, _job_embeddings, _jobs_data, _initialized

    if _initialized:
        return

    _initialized = True
    print("Initializing Job Matcher...")

    possible_paths = [
        _repo_root() / "job_title_des.csv",
        Path.cwd() / "job_title_des.csv",
        Path.cwd().parent / "job_title_des.csv",
        Path.cwd().parent.parent / "job_title_des.csv",
    ]

    csv_path = next((path for path in possible_paths if path.exists()), None)
    if not csv_path:
        print("Warning: job_title_des.csv not found. Job matching will be empty.")
        _jobs_data = _empty_jobs_frame()
        _job_embeddings = np.empty((0, 0), dtype=np.float32)
        return

    try:
        _jobs_data = pd.read_csv(csv_path, index_col=0).fillna("")
        print(f"Loaded {len(_jobs_data)} job descriptions")
    except Exception as exc:
        print(f"Error loading job data: {exc}")
        _jobs_data = _empty_jobs_frame()
        _job_embeddings = np.empty((0, 0), dtype=np.float32)
        return

    if not config.ENABLE_EMBEDDINGS:
        _model = None
        _job_embeddings = np.empty((0, 0), dtype=np.float32)
        return

    if not _semantic_enabled:
        _model = None
        _job_embeddings = np.empty((0, 0), dtype=np.float32)
        print("Semantic job matching disabled; using keyword-only matching.")
        return

    try:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(config.EMBED_MODEL, local_files_only=True)
        descriptions = _jobs_data["Job Description"].tolist()
        _job_embeddings = _model.encode(descriptions, normalize_embeddings=True)
        print(f"Created embeddings for {len(_job_embeddings)} jobs")
    except Exception as exc:
        print(f"Embeddings unavailable, using keyword-only matching: {exc}")
        _model = None
        _job_embeddings = np.empty((0, 0), dtype=np.float32)


def extract_skills_from_text(text: str) -> dict:
    initialize_job_matcher()

    if not text:
        return {"skills": [], "skill_names": []}

    text_lower = text.lower()
    found_skills = {}

    for skill, keywords in SKILL_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower:
                found_skills[skill] = {
                    "skill": skill,
                    "found_by": "keyword",
                    "confidence": 85,
                }
                break

    if (
        _model is not None
        and _job_embeddings is not None
        and len(_job_embeddings) > 0
        and len(text.split()) > 5
    ):
        try:
            text_embedding = _model.encode([text], normalize_embeddings=True)
            similarities = np.dot(text_embedding, _job_embeddings.T)[0]
            top_indices = np.argsort(similarities)[-3:][::-1]

            for idx in top_indices:
                if idx >= len(_jobs_data):
                    continue
                job_title = str(_jobs_data.iloc[idx]["Job Title"]).lower()
                for skill, keywords in SKILL_KEYWORDS.items():
                    if skill in found_skills:
                        continue
                    if any(keyword in job_title for keyword in keywords):
                        found_skills[skill] = {
                            "skill": skill,
                            "found_by": "semantic",
                            "confidence": 75,
                        }
        except Exception as exc:
            print(f"Semantic skill extraction skipped: {exc}")

    ordered = sorted(
        found_skills.values(),
        key=lambda item: (-item["confidence"], item["skill"]),
    )
    return {
        "skills": ordered,
        "skill_names": [item["skill"] for item in ordered],
    }


def match_skills_to_jobs(skills: list) -> list:
    initialize_job_matcher()

    if _jobs_data is None or _jobs_data.empty:
        return []

    normalized_skills = [
        skill if isinstance(skill, str) else skill.get("skill", "")
        for skill in skills
    ]
    normalized_skills = [skill for skill in normalized_skills if skill]
    if not normalized_skills:
        return []

    matched_jobs = []

    if _model is not None and _job_embeddings is not None and len(_job_embeddings) > 0:
        for skill_name in normalized_skills:
            try:
                skill_embedding = _model.encode([skill_name], normalize_embeddings=True)
                similarities = np.dot(skill_embedding, _job_embeddings.T)[0]
                top_indices = np.argsort(similarities)[-5:][::-1]
            except Exception as exc:
                print(f"Semantic job match skipped for {skill_name}: {exc}")
                continue

            for idx in top_indices:
                if idx >= len(_jobs_data):
                    continue
                job_title = _jobs_data.iloc[idx]["Job Title"]
                similarity_score = round(float(similarities[idx]) * 100, 1)
                job_match = next((job for job in matched_jobs if job["job_title"] == job_title), None)
                if job_match:
                    if skill_name not in job_match["matching_skills"]:
                        job_match["matching_skills"].append(skill_name)
                    job_match["avg_score"] = round((job_match["avg_score"] + similarity_score) / 2, 1)
                else:
                    matched_jobs.append({
                        "job_title": job_title,
                        "matching_skills": [skill_name],
                        "avg_score": similarity_score,
                    })

        if matched_jobs:
            matched_jobs.sort(key=lambda item: item["avg_score"], reverse=True)
            return matched_jobs[:10]

    for _, row in _jobs_data.iterrows():
        haystack = f"{row['Job Title']} {row['Job Description']}".lower()
        matching_skills = []
        raw_score = 0

        for skill_name in normalized_skills:
            skill_score = _score_keyword_match(skill_name, haystack)
            if skill_score > 0 or skill_name.lower() in haystack:
                matching_skills.append(skill_name)
                raw_score += max(skill_score, 1)

        if matching_skills:
            matched_jobs.append({
                "job_title": row["Job Title"],
                "matching_skills": matching_skills,
                "avg_score": min(99.0, round(55 + (raw_score * 10), 1)),
            })

    matched_jobs.sort(key=lambda item: (-len(item["matching_skills"]), -item["avg_score"], item["job_title"]))
    return matched_jobs[:10]


def get_job_description(job_title: str) -> dict:
    initialize_job_matcher()

    if _jobs_data is None or _jobs_data.empty:
        return None

    matching_rows = _jobs_data[_jobs_data["Job Title"].str.lower() == job_title.lower()]
    if matching_rows.empty:
        return None

    row = matching_rows.iloc[0]
    description = row["Job Description"]
    
    # Extract required skills from the description
    extraction = extract_skills_from_text(description)
    
    return {
        "job_title": row["Job Title"],
        "description": description,
        "required_skills": extraction.get("skill_names", [])
    }


def get_all_jobs() -> list:
    initialize_job_matcher()

    if _jobs_data is None or _jobs_data.empty:
        return []

    return _jobs_data["Job Title"].tolist()
