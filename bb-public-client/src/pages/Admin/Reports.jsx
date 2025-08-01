// src/pages/Admin/Reports.jsx
import React, { useState, useEffect } from 'react';
import { fetchBooks } from '../../api/books';
import { fetchAllUsers } from '../../api/users';
import { fetchBorrowRecords } from '../../api/borrowRecords';
import { fetchReservations } from '../../api/reservations';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [stats,   setStats]   = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalBorrowed: 0,
    totalOverdue: 0,
    totalReservations: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        // fetch everything in parallel
        const [books, users, records, reservations] = await Promise.all([
          fetchBooks(),
          fetchAllUsers(),
          fetchBorrowRecords(),    // admin sees all records
          fetchReservations()
        ]);

        const now = Date.now();
        // active borrow = returnedAt === null
        const activeBorrows = records.filter(r => !r.returnedAt);
        // overdue = active and dueAt < now
        const overdueCount = activeBorrows.filter(r =>
          new Date(r.dueAt) < now
        ).length;

        setStats({
          totalBooks: books.length,
          totalUsers: users.length,
          totalBorrowed: activeBorrows.length,
          totalOverdue: overdueCount,
          totalReservations: reservations.length
        });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading reports…</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="page admin-reports">
      <h1>Admin Dashboard: Reports</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: '1rem',
        }}
      >
        <div className="card summary-box">
          <h2>{stats.totalBooks}</h2>
          <p>Total Books</p>
        </div>
        <div className="card summary-box">
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>
        <div className="card summary-box">
          <h2>{stats.totalBorrowed}</h2>
          <p>Currently Borrowed</p>
        </div>
        <div className="card summary-box">
          <h2>{stats.totalOverdue}</h2>
          <p>Overdue Books</p>
        </div>
        <div className="card summary-box">
          <h2>{stats.totalReservations}</h2>
          <p>Active Reservations</p>
        </div>
      </div>
    </div>
  );
}

