// src/components/SummaryBox.jsx
import React from 'react';

export default function SummaryBox({ total, dueSoon, overdue }) {
  return (
    <div className="summary-box">
      <p><strong>Total Books Borrowed:</strong> {total}</p>
      <p><strong>Books Due Soon:</strong> {dueSoon}</p>
      <p><strong>Overdue Books:</strong> {overdue}</p>
    </div>
  );
}
