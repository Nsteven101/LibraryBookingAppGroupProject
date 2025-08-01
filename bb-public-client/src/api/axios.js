// src/api/axios.js
import axios from 'axios';

// Reads REACT_APP_API_URL from your .env (e.g. http://localhost:5000/api)
const api = axios.create({
  baseURL: '/api'
});

// Attach the token on every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
