// src/api/reservations.js
import api from './axios';

export const fetchReservations = async () => {
  const { data } = await api.get('/reservations');
  return data;
};

export const fetchReservationById = async (id) => {
  const { data } = await api.get(`/reservations/${id}`);
  return data;
};

export const createReservation = ({ book, expiresAt }) =>
  api.post('/reservations', { book, expiresAt });

// Admin-only:
export const updateReservation = async (id, payload) => {
  const { data } = await api.put(`/reservations/${id}`, payload);
  return data;
};

export const deleteReservation = async (id) => {
  const { data } = await api.delete(`/reservations/${id}`);
  return data;
};

export const deleteAllReservations = async () => {
  const { data } = await api.delete('/reservations');
  return data;
};
