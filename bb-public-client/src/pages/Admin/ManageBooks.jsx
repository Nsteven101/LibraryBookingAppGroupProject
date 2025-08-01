// src/pages/Admin/ManageBooks.jsx
import React, { useState, useEffect } from 'react';
import { fetchBooks, deleteBook } from '../../api/books';
import { Link } from 'react-router-dom';

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await deleteBook(id);
      setBooks(bs => bs.filter(b => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="page admin-manage-books">
      <h1>Manage Books</h1>
      <Link to="/admin/books/new" className="btn">Add New Book</Link>
      <table>
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b._id}>
              <td>{b.bookId}</td>
              <td>{b.title}</td>
              <td>
                <Link to={`/admin/books/edit/${b._id}`}>Edit</Link>
                <button onClick={() => handleDelete(b._id)} className="btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
