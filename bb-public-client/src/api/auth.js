// src/api/auth.js
import api from './axios';

export const login = async (email, password) => {
  const { data } = await api.post('/users/login', { email, password });
  localStorage.setItem('token', data.token);
  return data;
};

export const register = async (name, email, password, role = 'user') => {
  const { data } = await api.post('/users/register', { name, email, password, role });
  return data;
};

export const logout = async () => {
  await api.post('/users/logout');
  localStorage.removeItem('token');
};

export const getProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data;
};

export const updateProfile = ({ name, email, password }) =>
  api.put('/users/profile', { name, email, password })
    .then(res => res.data);