import api from './axios';

// GET    /api/users            (admin only)
export const fetchAllUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

// GET    /api/users/:id        (self or admin)
export const fetchUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

// PUT    /api/users/:id        (self or admin)
export const updateUser = async (id, updates) => {
  const { data } = await api.put(`/users/${id}`, updates);
  return data;
};

// DELETE /api/users/:id        (admin only)
export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

// DELETE /api/users            (bulk delete, admin only)
export const deleteAllUsers = async () => {
  const { data } = await api.delete('/users');
  return data;
};

