import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import MainLayout from './layouts/MainLayout';

import Login      from './pages/Login';
import Books      from './pages/Books';
import BorrowPage from './pages/BorrowPage';
import MyBooks    from './pages/MyBooks';
import ReturnPage from './pages/ReturnPage';
import Profile    from './pages/Profile';

import Dashboard   from './pages/Admin/Dashboard';
import ManageBooks from './pages/Admin/ManageBooks';
import Users       from './pages/Admin/Users';
import Reports     from './pages/Admin/Reports';
import EditBook    from './pages/Admin/EditBook';
import EditUser    from './pages/Admin/EditUser';
import CreateBook from './pages/Admin/CreateBook';
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user)   return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Authenticated */}
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/"               element={<Books />} />
          <Route path="/books/:id/borrow" element={<BorrowPage />} />
          <Route path="/my-books"         element={<MyBooks />} />
          <Route path="/books/:id/return" element={<ReturnPage />} />
          <Route path="/profile"                element={<Profile />} />

        </Route>

        {/* Admin only */}
        <Route element={<AdminRoute><MainLayout /></AdminRoute>}>
          <Route path="/admin"              element={<Dashboard />} />
          <Route path="/admin/manage-books" element={<ManageBooks />} />
          <Route path="/admin/books/new"            element={<CreateBook />} />
          <Route path="/admin/users"        element={<Users />} />
          <Route path="/admin/books/edit/:id" element={<EditBook />} />
                    <Route path="/admin/users/edit/:id" element={<EditUser />} />
          <Route path="/admin/reports"      element={<Reports />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
