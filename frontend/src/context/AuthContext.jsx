import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkLoggedIn = async () => {
      try {
        const res = await axios.get('/auth/me');
        setUser(res.data);
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
  };

  const signup = async (name, email, password, role) => {
    const res = await axios.post('/auth/signup', { name, email, password, role });
    setUser(res.data);
  };

  const logout = async () => {
    await axios.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
