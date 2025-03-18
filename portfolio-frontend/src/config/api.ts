export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  PROJECTS: `${API_BASE_URL}/api/projects`,
  ME: `${API_BASE_URL}/api/me`,
}; 