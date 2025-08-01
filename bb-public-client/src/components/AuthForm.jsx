// src/components/AuthForm.jsx
import React, { useState } from 'react';

export default function AuthForm({ mode = 'login', onSubmit, toggleMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(isLogin ? { email, password } : { name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {!isLogin && (
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
      )}
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn">
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
      
    </form>
  );
}
