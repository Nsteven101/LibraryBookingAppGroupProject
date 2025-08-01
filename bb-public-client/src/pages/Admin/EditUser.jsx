import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchUserById, updateUser } from '../../api/users';

export default function EditUser() {
  const { id } = useParams();
  const nav     = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const u = await fetchUserById(id);
        setForm({ name: u.name, email: u.email, role: u.role });
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    })();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await updateUser(id, form);
      nav('/admin/users');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!form.name) return <p>Loading…</p>;

  return (
    <div className="page admin-edit-user">
      <h1>Edit User</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button className="btn" type="submit">Save Changes</button>
        <Link to="/admin/users" className="btn">Cancel</Link>
      </form>
    </div>
  );
}
