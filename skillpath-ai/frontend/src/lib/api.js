import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
});

export const uploadDocuments = async (resumeFile, jdFile, jdText) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  if (jdFile) formData.append('jd', jdFile);
  if (jdText) formData.append('jd_text', jdText);
  
  try {
    const { data } = await api.post('/upload', formData);
    return data;
  } catch (error) {
    toast.error("Upload failed: " + (error.response?.data?.detail || error.message));
    throw error;
  }
};

export const loadRandomDataset = async (category) => {
  try {
    const { data } = await api.get(`/random-dataset/${category}`);
    return data;
  } catch (error) {
    toast.error("Failed to load random dataset: " + (error.response?.data?.detail || error.message));
    throw error;
  }
};


export const extractSkills = async (resumeText, jdText, sessionId) => {
  try {
    const { data } = await api.post('/extract-skills', {
      resume_text: resumeText,
      jd_text: jdText,
      session_id: sessionId
    });
    return data;
  } catch (error) {
    toast.error("Extraction failed.");
    throw error;
  }
};

export const generateRoadmap = async (sessionId) => {
  try {
    const { data } = await api.post('/generate-roadmap', { session_id: sessionId });
    return data;
  } catch (error) {
    toast.error("Roadmap generation failed.");
    throw error;
  }
};

export const recommendCourses = async (skill, month, sessionId) => {
  try {
    const { data } = await api.post('/recommend-courses', { skill, month, session_id: sessionId });
    return data;
  } catch (error) {
    toast.error("Course recommendation failed.");
    throw error;
  }
};

export const generateTest = async (month, sessionId) => {
  try {
    const { data } = await api.post('/generate-test', { month, session_id: sessionId });
    return data;
  } catch (error) {
    toast.error("Test generation failed.");
    throw error;
  }
};

export const submitTest = async (month, answers, simulationResponse, sessionId) => {
  try {
    const { data } = await api.post('/submit-test', {
      month,
      answers,
      simulation_response: simulationResponse,
      session_id: sessionId
    });
    return data;
  } catch (error) {
    toast.error("Test submission failed.");
    throw error;
  }
};

export const runSimulation = async (type, response, taskId, sessionId) => {
  try {
    const { data } = await api.post('/run-simulation', {
      type,
      response,
      task_id: taskId,
      session_id: sessionId
    });
    return data;
  } catch (error) {
    toast.error("Simulation run failed.");
    throw error;
  }
};

export const getReasoningTrace = async (sessionId) => {
  try {
    const { data } = await api.get(`/reasoning-trace/${sessionId}`);
    return data;
  } catch (error) {
    console.error("Failed to fetch reasoning trace.");
    return { decisions: [] };
  }
};

// Job Matching API (New - Local Model)

export const matchSkillsToJobs = async (skills, sessionId) => {
  try {
    const { data } = await api.post('/match-skills-to-jobs', {
      skills: Array.isArray(skills) ? skills : [skills],
      session_id: sessionId
    });
    return data;
  } catch (error) {
    toast.error("Job matching failed: " + (error.response?.data?.detail || error.message));
    throw error;
  }
};

export const getJobDescription = async (jobTitle) => {
  try {
    const { data } = await api.post('/job-description', {
      job_title: jobTitle
    });
    return data;
  } catch (error) {
    toast.error("Failed to load job description: " + (error.response?.data?.detail || error.message));
    throw error;
  }
};

export const getAllJobs = async () => {
  try {
    const { data } = await api.get('/all-jobs');
    return data;
  } catch (error) {
    console.error("Failed to load job list");
    return { jobs: [], total_jobs: 0 };
  }
};
