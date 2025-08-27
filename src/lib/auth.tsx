
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
    // We start fresh on each full app load. No session restoration.
    setIsLoaded(true);
  }, []);

  const login = (loggedInUser: User) => {
    setUser(loggedInUser);
    // You could store this in sessionStorage if you want session-only persistence
    // For this requirement, we don't persist it across tabs/restarts.
  };

  const logout = () => {
    setUser(null);
    // No need to clear storage if we don't set it.
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
