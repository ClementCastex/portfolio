export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://clementcastex.art';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  PROJECTS: `${API_BASE_URL}/api/projects`,
  ME: `${API_BASE_URL}/api/me`,
  NOTES: `${API_BASE_URL}/api/notes`,
  KANBANS: `${API_BASE_URL}/api/kanbans`,
  COLUMNS: `${API_BASE_URL}/api/columns`,
  CARDS: `${API_BASE_URL}/api/cards`,
  FILES: `${API_BASE_URL}/api/files`,
  LINKS: `${API_BASE_URL}/api/links`,
  COMMENTS: `${API_BASE_URL}/api/comments`,
  TAGS: `${API_BASE_URL}/api/kanban-tags`,
  CALENDAR: `${API_BASE_URL}/api/calendar`,
  ADMIN: `${API_BASE_URL}/api/admin`,
};