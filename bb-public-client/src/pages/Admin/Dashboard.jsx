// src/pages/Admin/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const cards = [
  { title: 'Manage Books',  link: '/admin/manage-books', icon: '📚' },
  { title: 'Manage Users',  link: '/admin/users',        icon: '👥' },
  { title: 'Reports',       link: '/admin/reports',      icon: '📈' }
];

export default function Dashboard() {
  return (
    <div className="page admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="card-grid">
        {cards.map(c => (
          <Link to={c.link} key={c.link} className="dashboard-card">
            <div className="card-icon">{c.icon}</div>
            <h3 className="card-title">{c.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
