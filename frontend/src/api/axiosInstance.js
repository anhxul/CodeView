import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage if present (fallback to cookie-based auth)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('codeview_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s globally by clearing local auth state
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('codeview_token');
      localStorage.removeItem('codeview_user');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;