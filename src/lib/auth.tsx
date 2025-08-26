
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoaded: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const login = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
