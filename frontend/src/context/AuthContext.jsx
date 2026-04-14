import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/users/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (email) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/users/send-otp', { email });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithOTP = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/users/verify-otp', { email, otp });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, login, logout, requestOTP, loginWithOTP }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
