/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { API_ENDPOINTS, getApiUrl } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  data?: {
    id: string;
    name: string;
    email: string;
    role: string;
    creditLimit?: number;
    availableCredit?: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    creditLimit?: number;
    availableCredit?: number;
  };
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  token: string;
  data?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    creditLimit?: number;
    availableCredit?: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    creditLimit?: number;
    availableCredit?: number;
  };
}

export interface AuthError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json() as AuthError;
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json() as LoginResponse;

      // Store token and user info - handle both 'data' and 'user' formats
      const user = data.data || data.user || {};
      this.setToken(data.token);
      this.setUser(user);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json() as AuthError;
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json() as RegisterResponse;

      // Store token and user info
      this.setToken(data.token);
      this.setUser(data.user);

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user profile
   */
  static async getMe(): Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.GET_ME), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearAuth();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      const user = data.data || data.user || data;
      
      // Update stored user data
      this.setUser(user);
      
      return user;
    } catch (error) {
      console.error('Get me error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      const token = this.getToken();
      
      if (token) {
        await fetch(getApiUrl(API_ENDPOINTS.AUTH.LOGOUT), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API response
      this.clearAuth();
    }
  }

  /**
   * Verify token validity
   */
  static async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      
      if (!token) {
        return false;
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.VERIFY), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }

  /**
   * Refresh token
   */
  static async refreshToken(): Promise<string | null> {
    try {
      const token = this.getToken();
      
      if (!token) {
        return null;
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.REFRESH_TOKEN), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        this.clearAuth();
        return null;
      }

      const data = await response.json() as { token: string };
      this.setToken(data.token);

      return data.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuth();
      return null;
    }
  }

  /**
   * Update user password (requires current password)
   */
  static async updatePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.UPDATE_PASSWORD), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update password');
      }

      return await response.json();
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }

  /**
   * Request password reset (sends reset token to email)
   */
  static async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.FORGOT_PASSWORD), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to request password reset');
      }

      return await response.json();
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  /**
   * Reset password using token
   */
  static async resetPassword(resetToken: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(getApiUrl(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${resetToken}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reset password');
      }

      return await response.json();
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Get stored auth token
   */
  static getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Set auth token
   */
  static setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  /**
   * Get stored user data
   */
  static getUser(): any | null {
    const user = localStorage.getItem(AUTH_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Set user data
   */
  static setUser(user: any): void {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Clear all auth data
   */
  static clearAuth(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }

  /**
   * Get Authorization header
   */
  static getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

export default AuthService;
