// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthForm from '../components/AuthForm';
import logo                from '../assets/logo.jpg'; 

export default function Login() {
  const { login, register } = useAuth();
  const navigate           = useNavigate();
  const [mode, setMode]    = useState('login');

  const handleSubmit = async (fields) => {
    try {
      if (mode === 'login') {
        await login(fields.email, fields.password);
      } else {
        await register(fields.name, fields.email, fields.password);
        await login(fields.email, fields.password);
      }
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={logo} alt="LibraryApp Logo" className="auth-logo" />
        <h1>{mode === 'login' ? 'Login' : 'Sign Up'}</h1>

        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
        />

        <p className="auth-switch">
          {mode === 'login'
            ? `Don't have an account? `
            : `Already have one? `}
          <a
   href={mode === 'login' ? '/register' : '/login'}
   onClick={e => {
     e.preventDefault(); 
     setMode(m => (m === 'login' ? 'register' : 'login'));
   }}
 >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </a>
        </p>
      </div>
    </div>
  );
}

