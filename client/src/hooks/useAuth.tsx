import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api } from '../lib/api.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { fullName?: string; phone?: string; avatarUrl?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('randere_auth_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch (err) {
        localStorage.removeItem('randere_auth_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data) {
      localStorage.setItem('randere_auth_token', res.data.token);
      setUser(res.data.user);
    }
  };

  const register = async (data: { email: string; password: string; fullName: string; phone?: string }) => {
    const res = await api.post('/auth/register', data);
    if (res.success && res.data) {
      localStorage.setItem('randere_auth_token', res.data.token);
      setUser(res.data.user);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {}
    localStorage.removeItem('randere_auth_token');
    setUser(null);
  };

  const updateProfile = async (data: { fullName?: string; phone?: string; avatarUrl?: string }) => {
    const res = await api.patch('/auth/profile', data);
    if (res.success && res.data) {
      setUser((prev) => (prev ? { ...prev, ...res.data } : res.data));
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
