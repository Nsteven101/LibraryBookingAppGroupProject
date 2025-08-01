// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { getProfile, updateProfile } from '../api/auth';


export default function Profile() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
        setForm({ name: profile.name, email: profile.email, password: '' });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const updated = await updateProfile(form);
      setUser(updated);
      setEditing(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (!user) return <p>Loading profile…</p>;

  return (
    <div className="page profile-page">
      <h1>My Profile</h1>

      {editing ? (
        <form onSubmit={handleSubmit} className="form">
          {error && <p className="error">{error}</p>}

          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
            />
          </div>

          <button type="submit" className="btn">Save Changes</button>
          <button
            type="button"
            className="btn"
            style={{ marginLeft: '0.5rem' }}
            onClick={() => { setEditing(false); setError(''); }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="profile-card card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

          <button
            className="btn"
            onClick={() => setEditing(true)}
            style={{ marginTop: '1rem' }}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

