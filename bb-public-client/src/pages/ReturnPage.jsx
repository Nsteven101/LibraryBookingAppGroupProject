import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { returnBook } from '../api/books';
import { fetchBorrowRecordById } from '../api/borrowRecords';
import ReturnForm from '../components/ReturnForm';

export default function ReturnPage() {
  const { id } = useParams(); // id can be record or book
  const [record, setRecord] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrowRecordById(id)
      .then(setRecord)
      .catch(err => console.error(err));
  }, [id]);

  const handleConfirm = async (bookId) => {
    try {
      await returnBook(bookId);
      navigate('/my-books');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return record ? (
    <div className="page return-page">
      <ReturnForm record={record} onConfirm={handleConfirm} />
    </div>
  ) : <p>Loading...</p>;
}
