import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBookById, borrowBook } from '../api/books';
import BorrowForm from '../components/BorrowForm';

export default function BorrowPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookById(id)
      .then(setBook)
      .catch(err => console.error(err));
  }, [id]);

  const handleConfirm = async (bookId, dueAt) => {
    try {
      await borrowBook(bookId, dueAt);
      navigate('/my-books');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return book ? (
    <div className="page borrow-page">
      <BorrowForm book={book} onConfirm={handleConfirm} />
    </div>
  ) : <p>Loading...</p>;
}
