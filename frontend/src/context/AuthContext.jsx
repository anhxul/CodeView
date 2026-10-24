import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '@/api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('codeview_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authApi.getMe();
      setUser(res.data.data.user);
    } catch (err) {
      localStorage.removeItem('codeview_token');
      localStorage.removeItem('codeview_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const persistAuth = (data) => {
    const { user: userData, token } = data;
    localStorage.setItem('codeview_token', token);
    localStorage.setItem('codeview_user', JSON.stringify(userData));
    setUser(userData);
  };

  const signup = async (payload) => {
    const res = await authApi.signup(payload);
    persistAuth(res.data.data);
    return res.data;
  };

  const login = async (payload) => {
    const res = await authApi.login(payload);
    persistAuth(res.data.data);
    return res.data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // ignore network errors on logout
    }
    localStorage.removeItem('codeview_token');
    localStorage.removeItem('codeview_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('codeview_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    updateUser,
    refreshUser: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}