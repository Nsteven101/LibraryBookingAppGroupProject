// src/api/borrowRecords.js
import api from './axios';

export const fetchBorrowRecords = async () => {
  const { data } = await api.get('/borrow-records');
  return data;
};

export const fetchBorrowRecordById = async (id) => {
  const { data } = await api.get(`/borrow-records/${id}`);
  return data;
};

export const createBorrowRecord = async (payload) => {
  const { data } = await api.post('/borrow-records', payload);
  return data;
};

export const updateBorrowRecord = (id, payload) =>
  api.put(`/borrow-records/${id}`, payload).then(res => res.data);

export const deleteBorrowRecord = async (id) => {
  const { data } = await api.delete(`/borrow-records/${id}`);
  return data;
};

export const deleteAllBorrowRecords = async () => {
  const { data } = await api.delete('/borrow-records');
  return data;
};

