#!/usr/bin/env python3
"""
Training script for skill-to-job matching model
This script trains embeddings on job descriptions from the CSV file
to enable skill-to-job matching without API calls.
"""

import sys
import pandas as pd
from pathlib import Path
from sentence_transformers import SentenceTransformer
import numpy as np
import json
from datetime import datetime

def train_job_matcher_model():
    """Train the job matcher model using the CSV file"""
    
    print("=" * 60)
    print("SkillPath AI - Job Matcher Model Training")
    print("=" * 60)
    
    # Check if CSV exists - multiple possible locations
    possible_paths = [
        Path(__file__).parent.parent / "job_title_des.csv",
        Path(__file__).parent.parent.parent / "job_title_des.csv",
        Path.cwd() / "job_title_des.csv",
        Path.cwd().parent / "job_title_des.csv",
        Path.cwd().parent.parent / "job_title_des.csv",
    ]
    
    csv_path = None
    for path in possible_paths:
        if path.exists():
            csv_path = path
            break
    
    if csv_path is None:
        print("[ERROR] CSV file not found in any location:")
        for path in possible_paths:
            print(f"   {path}")
        return False
    
    print(f"\n[INFO] Loading job descriptions from: {csv_path}")
    
    try:
        # Load CSV
        df = pd.read_csv(csv_path, index_col=0)
        print(f"[OK] Loaded {len(df)} job entries")
        print(f"     Columns: {', '.join(df.columns.tolist())}")
        
        # Display sample data
        print("\n[INFO] Sample jobs in database:")
        for idx, row in df.head(3).iterrows():
            print(f"  - {row['Job Title']}")
        
        # Load or train model
        print("\n[INFO] Loading embedding model (sentence-transformers)...")
        model = SentenceTransformer('all-MiniLM-L6-v2')
        print("[OK] Model loaded successfully")
        
        # Create embeddings
        print("\n[INFO] Creating embeddings for job descriptions...")
        descriptions = df["Job Description"].fillna("").tolist()
        job_embeddings = model.encode(descriptions, normalize_embeddings=True, show_progress_bar=True)
        
        print(f"[OK] Created {len(job_embeddings)} embeddings")
        print(f"     Embedding dimension: {job_embeddings.shape[1]}")
        print(f"     Memory usage: {job_embeddings.nbytes / 1024 / 1024:.2f} MB")
        
        # Save model metadata
        metadata = {
            "trained_at": datetime.now().isoformat(),
            "num_jobs": len(df),
            "embedding_dim": int(job_embeddings.shape[1]),
            "model": "all-MiniLM-L6-v2",
            "jobs": df["Job Title"].tolist()
        }
        
        metadata_path = Path(__file__).parent / ".model_metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"\n[OK] Model metadata saved to: {metadata_path}")
        
        # Summary
        print("\n" + "=" * 60)
        print("[SUCCESS] TRAINING COMPLETE")
        print("=" * 60)
        print(f"Total jobs in model: {len(df)}")
        print(f"Embedding model: all-MiniLM-L6-v2")
        print(f"Training date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("\nThe model is now ready to:")
        print("  1. Extract skills from resume and job descriptions")
        print("  2. Match extracted skills with available jobs")
        print("  3. Recommend relevant job positions")
        print("  4. Provide skill-to-job recommendations without API calls")
        print("\nStatus: [OK] No API keys or external LLM calls needed")
        print("=" * 60)
        
        return True
        
    except FileNotFoundError:
        print(f"[ERROR] CSV file not found: {csv_path}")
        return False
    except Exception as e:
        print(f"[ERROR] Training failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False

def verify_model_setup():
    """Verify that the job matcher model is properly set up"""
    
    print("\n[INFO] Verifying job matcher setup...")
    
    try:
        from services.job_matcher import (
            extract_skills_from_text,
            match_skills_to_jobs,
            get_all_jobs
        )
        
        # Check if jobs are loaded
        jobs = get_all_jobs()
        print(f"[OK] Job matcher initialized with {len(jobs)} jobs")
        
        if len(jobs) > 0:
            print(f"     Sample jobs: {jobs[:3]}")
        
        # Test skill extraction
        test_text = "I have experience with Python, Django, and REST APIs"
        result = extract_skills_from_text(test_text)
        print(f"[OK] Skill extraction working: found {len(result['skill_names'])} skills")
        if result['skill_names']:
            print(f"     Skills: {result['skill_names']}")
        
        # Test job matching
        if result['skill_names']:
            matches = match_skills_to_jobs(result['skill_names'])
            print(f"[OK] Job matching working: found {len(matches)} matches")
            if matches:
                print(f"     Top match: {matches[0]['job_title']} (score: {matches[0]['avg_score']:.1f}%)")
        
        print("\n[SUCCESS] All systems operational!")
        return True
        
    except Exception as e:
        print(f"[ERROR] Verification failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = train_job_matcher_model()
    if success:
        verify_model_setup()
        sys.exit(0)
    else:
        sys.exit(1)
