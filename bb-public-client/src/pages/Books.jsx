// src/pages/Books.jsx
import React, { useState, useEffect } from 'react';
import { fetchBooks, borrowBook } from '../api/books';
import { fetchReservations, createReservation } from '../api/reservations';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');

  // decode current user ID from JWT
  const token = localStorage.getItem('token');
  const currentUser = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  useEffect(() => {
    (async () => {
      try {
        const [bookList, reservations] = await Promise.all([
          fetchBooks(),
          fetchReservations(),
        ]);

        // build reservation map with null check
        const reservedMap = reservations.reduce((acc, r) => {
          if (r.book && r.book._id) {
            acc[r.book._id] = r.user._id;
          }
          return acc;
        }, {});

        // enrich books with reservedBy
        const enriched = bookList.map(b => ({
          ...b,
          reservedBy: reservedMap[b._id] || null,
        }));

        setBooks(enriched);
      } catch (err) {
        console.error('Failed loading books or reservations', err);
      }
    })();
  }, []);

  const handleBorrow = async id => {
    try {
      const due = new Date(Date.now() + 7*24*60*60*1000).toISOString();
      await borrowBook(id, due);
      setBooks(bs =>
        bs.map(b =>
          b._id === id
            ? { ...b, borrowedBy: currentUser, reservedBy: null }
            : b
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleReserve = async id => {
    try {
      const expiresAt = new Date(Date.now() + 3*24*60*60*1000).toISOString();
      await createReservation({ book: id, expiresAt });
      setBooks(bs =>
        bs.map(b => (b._id === id ? { ...b, reservedBy: currentUser } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(q.toLowerCase()) ||
    b.authors.some(a => a.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="page books-page">
      <h1>Browse Books</h1>
      <SearchBar value={q} onChange={setQ} placeholder="Search books…" />

      <div className="book-grid">
        {filtered.map(book => (
          <BookCard
            key={book._id}
            book={book}
            currentUserId={currentUser}
            onBorrow={handleBorrow}
            onReserve={handleReserve}
          />
        ))}
      </div>
    </div>
  );
}



