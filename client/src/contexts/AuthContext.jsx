import { createContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('goalSyncUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('goalSyncUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('goalSyncUser');
    }
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('goalSyncToken', response.data.token);
      setUser(response.data.user);
      setToast({ type: 'success', message: 'Welcome back, ' + response.data.user.name });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Unable to sign in. Please try again.';
      setToast({ type: 'error', message });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', payload);
      localStorage.setItem('goalSyncToken', response.data.token);
      setUser(response.data.user);
      setToast({ type: 'success', message: 'Account created successfully' });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Unable to create account. Please try again.';
      setToast({ type: 'error', message });
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('goalSyncToken');
    setUser(null);
    setToast({ type: 'info', message: 'Logged out successfully' });
  };

  const value = useMemo(() => ({ user, loading, toast, setToast, login, register, logout }), [user, loading, toast]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
