// src/pages/Admin/CreateBook.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createBook } from '../../api/books';

export default function CreateBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    bookId: '',
    title: '',
    authors: '',      // comma-separated IDs
    categories: ''    // comma-separated IDs
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // build payload
    const payload = {
      bookId: form.bookId.trim(),
      title: form.title.trim(),
      authors: form.authors.split(',').map(s => s.trim()),
      categories: form.categories.split(',').map(s => s.trim())
    };
    try {
      await createBook(payload);
      navigate('/admin/manage-books');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="page admin-create-book">
      <h1>Add New Book</h1>
      {error && <p className="error">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Book ID</label>
          <input
            name="bookId"
            value={form.bookId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Authors (IDs, comma-separated)</label>
          <input
            name="authors"
            value={form.authors}
            onChange={handleChange}
            placeholder="e.g. 5f...a, 5f...b"
            required
          />
        </div>
        <div className="form-group">
          <label>Categories (IDs, comma-separated)</label>
          <input
            name="categories"
            value={form.categories}
            onChange={handleChange}
            placeholder="e.g. 5f...x, 5f...y"
            required
          />
        </div>
        <button type="submit" className="btn">Create Book</button>
        <Link to="/admin/manage-books" className="btn">Cancel</Link>
      </form>
    </div>
  );
}
