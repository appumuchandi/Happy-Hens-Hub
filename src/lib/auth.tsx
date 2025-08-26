
'use client';

import type { ReactNode } from 'react';
import React, from 'react';
import { createContext, useState, useEffect } from 'react';
import type { User, Role } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoaded: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ownerUser: User = {
  name: 'Farm Owner',
  email: 'owner@henshub.com',
  role: 'OWNER',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('user');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const login = () => {
    setUser(ownerUser);
    localStorage.setItem('user', JSON.stringify(ownerUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isLoaded, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
