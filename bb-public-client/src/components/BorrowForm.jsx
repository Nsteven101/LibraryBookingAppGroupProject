// src/components/BorrowForm.jsx
import React, { useState, useEffect } from 'react';
import format from '../utils/formatDate';

export default function BorrowForm({ book, onConfirm }) {
  const [duration, setDuration] = useState(7);
  const [borrowDate, setBorrowDate] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');

  useEffect(() => {
    if (borrowDate) {
      const dt = new Date(borrowDate);
      dt.setDate(dt.getDate() + parseInt(duration, 10));
      setExpectedReturn(dt.toISOString().substr(0,10));
    }
  }, [borrowDate, duration]);

  const handleSubmit = e => {
    e.preventDefault();
    onConfirm(book._id, expectedReturn);
  };

  return (
    <form onSubmit={handleSubmit} className="borrow-form">
      <h2>Confirm Book Borrowing</h2>
      <div className="book-info">
        <p><strong>{book.title}</strong></p>
        <p>Author: {book.authors.map(a => a.name).join(', ')}</p>
        <p>ISBN: {book.bookId}</p>
      </div>
      <div className="form-group">
        <label>Borrowing Duration</label>
        <select value={duration} onChange={e => setDuration(e.target.value)}>
          {[7,14,21].map(d => (
            <option key={d} value={d}>{d} days</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Borrow Date</label>
        <input
          type="date"
          value={borrowDate}
          onChange={e => setBorrowDate(e.target.value)}
          required
        />
      </div>
      {expectedReturn && (
        <p>
          <strong>Expected Return Date:</strong>{' '}
          {format(new Date(expectedReturn))}
        </p>
      )}
      <button type="submit" className="btn">Confirm Borrowing</button>
    </form>
  );
}
