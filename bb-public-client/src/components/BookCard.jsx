// src/components/BookCard.jsx
import React from 'react';

export default function BookCard({
  book,
  currentUserId,
  onBorrow,
  onReserve,
}) {
  const isBorrowed = Boolean(book.borrowedBy);
  const isReserved = Boolean(book.reservedBy);
  const reservedByMe = book.reservedBy === currentUserId;

  // can borrow only if not borrowed AND (not reserved or reserved by me)
  const canBorrow = !isBorrowed && (!isReserved || reservedByMe);

  return (
    <div className="book-card card">
      <h3>{book.title}</h3>
      <p><strong>Author:</strong> {book.authors.map(a => a.name).join(', ')}</p>
      <p><strong>Genre:</strong> {book.categories.map(c => c.name).join(', ')}</p>
      <p>
        <strong>Status:</strong>{' '}
        <span className={isBorrowed ? 'status-borrowed' : 'status-available'}>
          {isBorrowed ? 'Borrowed' : 'Available'}
        </span>
        {isReserved && (
          <span style={{ marginLeft: '0.5rem', fontStyle: 'italic' }}>
            (Reserved{reservedByMe ? ' by you' : ''})
          </span>
        )}
      </p>
      <div className="actions">
        <button
          className="btn"
          onClick={() => onBorrow(book._id)}
          disabled={!canBorrow}
        >
          Borrow Now
        </button>
        <button
          className="btn btn-reserve"
          onClick={() => onReserve(book._id)}
          disabled={isReserved}
        >
          Reserve
        </button>
      </div>
    </div>
  );
}





