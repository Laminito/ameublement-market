import { getApiUrl } from './api';
import AuthService from './authService';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  parent: string | null;
  createdAt: string;
  updatedAt: string;
}

class CategoryService {
  /**
   * Get all categories
   */
  static async getCategories(isActive?: boolean): Promise<Category[]> {
    try {
      let url = getApiUrl('/categories');
      if (isActive !== undefined) {
        url += `?isActive=${String(isActive)}`;
      }

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await fetch(getApiUrl(`/categories/${id}`), {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Category not found');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get category error:', error);
      throw error;
    }
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(slug: string): Promise<Category> {
    try {
      const response = await fetch(getApiUrl(`/categories/slug/${slug}`), {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Category not found');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get category by slug error:', error);
      throw error;
    }
  }

  /**
   * Create category (Admin only)
   */
  static async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl('/admin/categories'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create category');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  }

  /**
   * Update category (Admin only)
   */
  static async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl(`/admin/categories/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update category');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  }

  /**
   * Delete category (Admin only)
   */
  static async deleteCategory(id: string): Promise<void> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl(`/admin/categories/${id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  }
}

export default CategoryService;
export type { Category };
