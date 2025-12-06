/**
 * Authentication Context
 * Provides authentication state and methods to the entire application
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import AuthService from '@/services/authService';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const storedToken = AuthService.getToken();
        const storedUser = AuthService.getUser();

        if (storedToken && storedUser) {
          // Try to get fresh user data from server
          try {
            const freshUser = await AuthService.getMe();
            setToken(storedToken);
            setUser(freshUser);
            setIsAuthenticated(true);
          } catch (err) {
            // If getMe fails, try to verify token
            const isValid = await AuthService.verifyToken();
            
            if (isValid) {
              setToken(storedToken);
              setUser(storedUser);
              setIsAuthenticated(true);
            } else {
              // Try to refresh token
              const newToken = await AuthService.refreshToken();
              if (newToken) {
                setToken(newToken);
                setUser(storedUser);
                setIsAuthenticated(true);
              } else {
                AuthService.clearAuth();
                setIsAuthenticated(false);
              }
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        AuthService.clearAuth();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      const userData = response.data || response.user || {};
      setToken(response.token);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setError(null);
    setLoading(true);
    try {
      const response = await AuthService.register(userData);
      const user = response.data || response.user || {};
      setToken(response.token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    setLoading(true);
    try {
      await AuthService.logout();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      const errorMessage = err.message || 'Logout failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
