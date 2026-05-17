import axios from 'axios';

const normalizeApiUrl = (url) => {
  const trimmed = url.replace(/\/+$|^\s+|\s+$/g, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return normalizeApiUrl(envUrl);
  const host = window?.location?.hostname || 'localhost';
  return `http://${host}:5000/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('goalSyncToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error('Network error: Unable to reach the authentication server.')); 
    }
    return Promise.reject(error);
  }
);

export default api;
