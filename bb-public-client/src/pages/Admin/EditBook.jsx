import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBookById, updateBook } from '../../api/books';

export default function EditBook() {
  const { id } = useParams();
  const nav     = useNavigate();
  const [book, setBook] = useState(null);
  const [form, setForm] = useState({ title: '', bookId: '', authors: [], categories: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBookById(id);
        setBook(data);
        setForm({
          title:      data.title,
          bookId:     data.bookId,
          authors:    data.authors.map(a => a._id),
          categories: data.categories.map(c => c._id)
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: Array.isArray(f[name]) ? value.split(',') : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBook(id, form);
      nav('/admin/manage-books');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!book)  return <p>Loading…</p>;

  return (
    <div className="page admin-edit-book">
      <h1>Edit Book</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Book ID</label>
          <input name="bookId" value={form.bookId} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Author IDs (comma-separated)</label>
          <input
            name="authors"
            value={form.authors.join(',')}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Category IDs (comma-separated)</label>
          <input
            name="categories"
            value={form.categories.join(',')}
            onChange={handleChange}
          />
        </div>
        <button className="btn" type="submit">Save Changes</button>
        <Link to="/admin/manage-books" className="btn">Cancel</Link>
      </form>
    </div>
  );
}
