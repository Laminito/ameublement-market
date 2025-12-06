/**
 * User Service
 * Handles all user-related API calls (profile, avatar, etc.)
 */

import { API_ENDPOINTS, getApiUrl } from './api';
import AuthService from './authService';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  creditLimit?: number;
  availableCredit?: number;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UploadAvatarRequest {
  file: File;
}

class UserService {
  /**
   * Get current user profile
   */
  static async getProfile(): Promise<UserProfile> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.PROFILE_ME), {
        method: 'GET',
        headers: {
          ...AuthService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          AuthService.clearAuth();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      return data.data || data.user || data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.UPDATE_PROFILE), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeader(),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const result = await response.json();
      
      // Update stored user data
      const updatedUser = result.data || result.user || result;
      AuthService.setUser(updatedUser);

      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(data: UpdatePasswordRequest): Promise<{ success: boolean; message: string }> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(getApiUrl('/users/change-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeader(),
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
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
   * Get current user avatar
   */
  static async getAvatar(): Promise<string | null> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        return null;
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.AVATAR_ME), {
        method: 'GET',
        headers: {
          ...AuthService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return result.avatar || result.url || null;
    } catch (error) {
      console.error('Error fetching avatar:', error);
      return null;
    }
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(file: File): Promise<{ success: boolean; url: string }> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(getApiUrl(API_ENDPOINTS.UPLOADS.AVATAR), {
        method: 'POST',
        headers: {
          ...AuthService.getAuthHeader(),
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload avatar');
      }

      const result = await response.json();
      
      // Update user avatar in localStorage
      const user = AuthService.getUser();
      if (user) {
        user.avatar = result.url || result.data?.url;
        AuthService.setUser(user);
      }

      return result;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  }

  /**
   * Get user credit information
   */
  static async getCredit() {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(getApiUrl('/users/credit'), {
        method: 'GET',
        headers: {
          ...AuthService.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credit information');
      }

      return await response.json();
    } catch (error) {
      console.error('Get credit error:', error);
      throw error;
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(password: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(getApiUrl('/users/account'), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeader(),
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete account');
      }

      // Clear auth after successful deletion
      AuthService.clearAuth();
      
      return await response.json();
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }
}

export default UserService;
