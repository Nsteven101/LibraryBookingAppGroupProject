import React, { useState, useEffect } from 'react';
import { fetchBorrowRecords } from '../api/borrowRecords';
import { returnBook } from '../api/books';
import BorrowedTable from '../components/BorrowedTable';

export default function MyBooks() {
  const [records, setRecords] = useState([]);

  // Load this user’s active borrows
  const loadRecords = async () => {
    try {
      const data = await fetchBorrowRecords();
      const token = localStorage.getItem('token');
      const meId = token
        ? JSON.parse(atob(token.split('.')[1])).id
        : null;

      // ✅ Safely filter out records with null users
      const filtered = data.filter(
        r => r.user && r.user._id === meId && !r.returnedAt
      );
      setRecords(filtered);
    } catch (err) {
      console.error('Failed to load borrow records:', err);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleReturn = async (bookId) => {
    try {
      await returnBook(bookId);
      await loadRecords();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="page mybooks-page">
      <h1>My Borrowed Books</h1>
      <BorrowedTable
        records={records}
        onReturn={handleReturn}
      />
    </div>
  );
}
