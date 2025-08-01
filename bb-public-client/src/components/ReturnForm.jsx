// src/components/ReturnForm.jsx
import React, { useState, useEffect } from 'react';
import format from '../utils/formatDate';

export default function ReturnForm({ record, onConfirm }) {
  const [condition, setCondition] = useState('Excellent');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  
  useEffect(() => {
    if (record.dueAt && record.returnedAt) {
      const returned = new Date(record.returnedAt);
      const due = new Date(record.dueAt);
      setStatus(returned <= due ? 'On Time' : 'Late');
    }
  }, [record]);

  const handleSubmit = e => {
    e.preventDefault();
    onConfirm(record.book._id, { condition, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="return-form">
      <h2>Return Book</h2>
      <div className="book-info">
        <p><strong>{record.book.title}</strong></p>
        <p>Author: {record.book.authors?.map(a=>a.name).join(', ')}</p>
        <p>Borrowed: {format(new Date(record.borrowedAt))}</p>
        <p>Due Date: {format(new Date(record.dueAt))}</p>
      </div>
      <div className="form-group">
        <label>Book Condition</label>
        <select value={condition} onChange={e => setCondition(e.target.value)}>
          {['Excellent','Good','Fair','Poor'].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Additional Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Any comments..."
        />
      </div>
      {record.returnedAt && (
        <div className="return-summary">
          <p><strong>Return Date:</strong> {format(new Date(record.returnedAt))}</p>
          <p><strong>Status:</strong> {status}</p>
        </div>
      )}
      <button type="submit" className="btn">Confirm Return</button>
    </form>
  );
}
