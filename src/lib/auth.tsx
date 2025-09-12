
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoaded: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function recordLogin(username: string) {
    const loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '{}');
    loginHistory[username] = new Date().toISOString();
    localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for user in sessionStorage to persist login across page reloads (but not browser close)
    try {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Could not parse user from sessionStorage", error);
        sessionStorage.removeItem('user');
    } finally {
        setIsLoaded(true);
    }
  }, []);

  const login = (loggedInUser: User) => {
    setUser(loggedInUser);
    try {
        sessionStorage.setItem('user', JSON.stringify(loggedInUser));
        recordLogin(loggedInUser.username);
    } catch (error) {
        console.error("Could not save user to sessionStorage", error);
    }
  };

  const logout = () => {
    setUser(null);
    try {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('cctvAuthenticated');
        sessionStorage.removeItem('credentialsAuthenticated');
    } catch (error) {
        console.error("Could not remove items from sessionStorage", error);
    }
    window.location.href = '/';
  };
  
  const authValue = useMemo(() => ({
    isAuthenticated: !!user,
    isLoaded,
    user,
    login,
    logout,
  }), [user, isLoaded]);

  return (
    <AuthContext.Provider value={authValue}>
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
