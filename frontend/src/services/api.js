import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth APIs ────────────────────────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getUserProfile = () => api.get('/auth/profile');
export const updateUserProfile = (data) => api.put('/auth/profile', data);

// ─── Resume APIs ──────────────────────────────────────────────────────────────
export const uploadResume = (formData) =>
  api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getResumes = () => api.get('/resume');
export const getResumeById = (id) => api.get(`/resume/${id}`);
export const deleteResume = (id) => api.delete(`/resume/${id}`);

// ─── AI APIs ──────────────────────────────────────────────────────────────────
export const analyzeResume = (resumeId) => api.post('/ai/analyze', { resumeId });
export const getAIJobs = (resumeId) => api.get(`/ai/jobs/${resumeId}`);

export default api;