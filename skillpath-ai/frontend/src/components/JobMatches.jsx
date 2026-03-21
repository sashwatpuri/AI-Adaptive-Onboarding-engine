import React, { useState, useEffect } from 'react';
import { matchSkillsToJobs, getJobDescription } from '../lib/api';
import toast from 'react-hot-toast';
import './JobMatches.css';

export default function JobMatches({ skills, sessionId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    if (skills && skills.length > 0) {
      loadJobMatches();
    }
  }, [skills, sessionId]);

  const loadJobMatches = async () => {
    if (!skills || skills.length === 0) {
      toast.error('No skills to match');
      return;
    }

    setLoading(true);
    try {
      // Extract just the skill names
      const skillNames = Array.isArray(skills) 
        ? skills.map(s => typeof s === 'string' ? s : s.skill) 
        : [skills];

      const response = await matchSkillsToJobs(skillNames, sessionId);
      setMatches(response.matched_jobs || []);
      
      if (response.matched_jobs?.length > 0) {
        toast.success(`Found ${response.matched_jobs.length} matching jobs`);
      } else {
        toast.info('No job matches found for your skills');
      }
    } catch (error) {
      console.error('Failed to match skills to jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = async (jobTitle) => {
    setSelectedJob(jobTitle);
    try {
      const details = await getJobDescription(jobTitle);
      setJobDetails(details);
    } catch (error) {
      toast.error('Failed to load job details');
    }
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
    setJobDetails(null);
  };

  if (loading) {
    return (
      <div className="job-matches-container">
        <div className="loading">Loading job matches...</div>
      </div>
    );
  }

  return (
    <div className="job-matches-container">
      <div className="section-header">
        <h2>Matched Job Opportunities</h2>
        <p className="subtitle">
          Based on your {skills.length} extracted skills
        </p>
      </div>

      {matches.length > 0 ? (
        <div className="matches-grid">
          {matches.map((match, idx) => (
            <div
              key={idx}
              className="job-card"
              onClick={() => handleJobClick(match.job_title)}
            >
              <div className="job-header">
                <h3>{match.job_title}</h3>
                <div className="score-badge">
                  {match.avg_score.toFixed(1)}%
                </div>
              </div>

              <div className="job-skills">
                <p><strong>Matching Skills:</strong></p>
                <div className="skill-tags">
                  {match.matching_skills.map((skill, i) => (
                    <span key={i} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="job-action">
                <button className="btn-view">View Details →</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-matches">
          <p>No job matches found for your skills.</p>
          <p className="hint">Try uploading a resume with more skills or project experience.</p>
        </div>
      )}

      {/* Job Details Modal */}
      {jobDetails && (
        <div className="modal-overlay" onClick={closeJobDetails}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeJobDetails}>✕</button>

            <div className="modal-header">
              <h2>{jobDetails.job_title}</h2>
              <div className="required-skills">
                <strong>Required Skills:</strong>
                <div className="skill-tags">
                  {jobDetails.required_skills.map((skill, i) => (
                    <span key={i} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-body">
              <h3>Job Description</h3>
              <p className="description">
                {jobDetails.description}
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn-apply" onClick={() => {
                toast.success('Job saved! Check your profile for more details.');
                closeJobDetails();
              }}>
                Save Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
