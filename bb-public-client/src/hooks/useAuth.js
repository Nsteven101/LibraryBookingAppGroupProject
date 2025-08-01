import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook to access auth context
export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
}
