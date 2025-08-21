'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import type { User, Role } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoaded: boolean; // To track if the initial auth check is complete
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<Role, User> = {
  OWNER: { name: 'Farm Owner', email: 'owner@henshub.com', role: 'OWNER' },
  WORKER: { name: 'Farm Worker', email: 'worker@henshub.com', role: 'WORKER' },
  VIEWER: { name: 'Farm Viewer', email: 'viewer@henshub.com', role: 'VIEWER' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false); // New state to track loading

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
      setIsLoaded(true); // Mark as loaded after checking localStorage
    }
  }, []);

  const login = (role: Role) => {
    const userToLogin = mockUsers[role];
    setUser(userToLogin);
    localStorage.setItem('user', JSON.stringify(userToLogin));
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
