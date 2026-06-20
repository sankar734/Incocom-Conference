import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token     = localStorage.getItem('adminToken');
    const savedData = localStorage.getItem('adminData');

    if (token && savedData) {
      // Optimistically set admin from localStorage while we verify
      try {
        setAdmin(JSON.parse(savedData));
      } catch {
        localStorage.removeItem('adminData');
      }

      // Verify token is still valid against the server
      verifyToken()
        .then(() => {
          // Token is valid — admin state already set above
        })
        .catch(() => {
          // Token is invalid — clear everything
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
          setAdmin(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, adminData) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
