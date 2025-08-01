import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, register as apiRegister, getProfile } from '../api/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(!!token);

  // on mount, if we have a token, fetch profile
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (err) {
        console.error('AuthContext: failed to fetch profile', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleLogin = async (email, password) => {
    const { token: newToken } = await apiLogin(email, password);
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const profile = await getProfile();
    setUser(profile);
  };

  const handleRegister = async (name, email, password) => {
    const result = await apiRegister(name, email, password);
    // optionally auto-login after register:
    await handleLogin(email, password);
    return result;
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.warn('AuthContext: logout API failed', err);
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login:    handleLogin,
      logout:   handleLogout,
      register: handleRegister
    }}>
      {children}
    </AuthContext.Provider>
  );
}
