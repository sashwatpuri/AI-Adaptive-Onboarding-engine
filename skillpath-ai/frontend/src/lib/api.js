import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
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
