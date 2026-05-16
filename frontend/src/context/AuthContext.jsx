import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkLoggedIn = async () => {
      // If this is a new tab/window, force a logout to clear the cookie
      if (!sessionStorage.getItem('session_active')) {
        try {
          await axios.post('/auth/logout');
        } catch (err) {}
      }

      try {
        const res = await axios.get('/auth/me');
        setUser(res.data);
        sessionStorage.setItem('session_active', 'true');
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    setUser(res.data);
    sessionStorage.setItem('session_active', 'true');
  };

  const signup = async (name, email, password, role) => {
    const res = await axios.post('/auth/signup', { name, email, password, role });
    setUser(res.data);
    sessionStorage.setItem('session_active', 'true');
  };

  const logout = async () => {
    await axios.post('/auth/logout');
    setUser(null);
    sessionStorage.removeItem('session_active');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
