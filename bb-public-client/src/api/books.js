import api from './axios';

// GET  /api/books
export const fetchBooks = async () => {
  const { data } = await api.get('/books');
  return data;
};

// GET  /api/books/:id
export const fetchBookById = async (id) => {
  const { data } = await api.get(`/books/${id}`);
  return data;
};

// POST /api/books/:id/borrow
export const borrowBook = async (id, dueAt) => {
  const { data } = await api.post(`/books/${id}/borrow`, { dueAt });
  return data;
};

// POST /api/books/:id/return
export const returnBook = async (id) => {
  const { data } = await api.post(`/books/${id}/return`);
  return data;
};

// POST   /api/books
export const createBook = async (book) => {
  const { data } = await api.post('/books', book);
  return data;
};

// PUT    /api/books/:id
export const updateBook = async (id, updates) => {
  const { data } = await api.put(`/books/${id}`, updates);
  return data;
};

// DELETE /api/books/:id
export const deleteBook = async (id) => {
  const { data } = await api.delete(`/books/${id}`);
  return data;
};

// DELETE /api/books           (bulk delete, admin only)
export const deleteAllBooks = async () => {
  const { data } = await api.delete('/books');
  return data;
};

