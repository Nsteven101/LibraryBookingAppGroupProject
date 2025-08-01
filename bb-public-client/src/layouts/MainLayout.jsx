import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import logoImg from '../assets/logo.jpg';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    await logout();
    nav('/login');
  };

  return (
    <div className="main-layout">
      <header className="header">
        <div className="logo">
          <Link to="/"><img src={logoImg} alt="My Library Logo" style={{ height: '40px' }} /></Link>
        </div>
        <nav className="nav-links">
          {!user && <Link to="/login">Login</Link>}
          {user && (
            <>
              <Link to="/books">Browse Books</Link>
              <Link to="/my-books">My Books</Link>
              <Link to="/profile">Profile</Link>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2025 BookVault</p>
      </footer>
    </div>
  );
}
