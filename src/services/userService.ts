/**
 * User Service
 * Handles all user-related API calls (profile, avatar, etc.)
 */

import { API_ENDPOINTS, getApiUrl } from './api';
import AuthService from './authService';

export interface UserProfile {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  creditLimit?: number;
  availableCredit?: number;
  address?: string;  // Street address
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  // Also support name as a single field for convenience
  name?: string;
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
   * Get full name from profile
   */
  static getFullName(profile: UserProfile | null): string {
    if (!profile) return '';
    
    // If name exists, use it
    if (profile.name) return profile.name;
    
    // Otherwise combine firstName and lastName
    const firstName = profile.firstName || '';
    const lastName = profile.lastName || '';
    return `${firstName} ${lastName}`.trim();
  }

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
      let profile = data.data || data.user || data;
      
      // Construct full name from firstName and lastName if name doesn't exist
      if (!profile.name && (profile.firstName || profile.lastName)) {
        profile.name = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
      }
      
      return profile;
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

      // Transform the request data to match backend API format
      const payload: any = {};
      
      // Handle name field - split into firstName and lastName if needed
      if (data.name) {
        const nameParts = data.name.trim().split(/\s+/);
        payload.firstName = nameParts[0] || '';
        payload.lastName = nameParts.slice(1).join(' ') || '';
      } else {
        if (data.firstName) payload.firstName = data.firstName;
        if (data.lastName) payload.lastName = data.lastName;
      }
      
      // Add other fields
      if (data.phone) payload.phone = data.phone;
      if (data.address) payload.address = data.address;
      if (data.city) payload.city = data.city;
      if (data.postalCode) payload.postalCode = data.postalCode;
      if (data.country) payload.country = data.country;

      const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.UPDATE_PROFILE), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeader(),
        },
        body: JSON.stringify(payload),
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
      // Handle different response formats
      if (result.data?.avatarUrl) {
        return result.data.avatarUrl;
      }
      if (result.data?.avatar) {
        return result.data.avatar;
      }
      if (result.avatarUrl) {
        return result.avatarUrl;
      }
      if (result.avatar) {
        return result.avatar;
      }
      if (result.url) {
        return result.url;
      }
      return null;
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
