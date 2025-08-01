// src/components/BorrowedTable.jsx
import React from 'react';
import formatDate from '../utils/formatDate';

export default function BorrowedTable({ records, onReturn}) {
  return (
    <table className="borrowed-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Borrow Date</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {records.map(r => {
          const overdue = new Date(r.dueAt) < Date.now();
          return (
            <tr key={r._id}>
              <td>{r.book.title}</td>
              <td>{formatDate(r.borrowedAt)}</td>
              <td>{formatDate(r.dueAt)}</td>
              <td className={overdue ? 'status-borrowed' : 'status-available'}>
                {overdue ? 'Overdue' : 'Active'}
              </td>
              <td>
                <button onClick={() => onReturn(r.book._id)} className="btn">
                  Return
                </button>
                
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

