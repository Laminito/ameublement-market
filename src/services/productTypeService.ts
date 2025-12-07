import { getApiUrl } from './api';
import AuthService from './authService';

interface ProductTypeAttribute {
  name: string;
  fieldType: 'select' | 'text' | 'number' | 'textarea';
  required: boolean;
  options?: string[];
}

interface ProductType {
  _id: string;
  name: string;
  code: string;
  description: string;
  attributes: ProductTypeAttribute[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class ProductTypeService {
  /**
   * Get all product types
   */
  static async getProductTypes(): Promise<ProductType[]> {
    try {
      const response = await fetch(getApiUrl('/product-types'), {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product types');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Get product types error:', error);
      throw error;
    }
  }

  /**
   * Get product type by ID
   */
  static async getProductTypeById(id: string): Promise<ProductType> {
    try {
      const response = await fetch(getApiUrl(`/product-types/${id}`), {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Product type not found');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get product type error:', error);
      throw error;
    }
  }

  /**
   * Get product type by code
   */
  static async getProductTypeByCode(code: string): Promise<ProductType> {
    try {
      const response = await fetch(getApiUrl(`/product-types/code/${code}`), {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Product type not found');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get product type by code error:', error);
      throw error;
    }
  }

  /**
   * Create product type (Admin only)
   */
  static async createProductType(typeData: Partial<ProductType>): Promise<ProductType> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl('/product-types'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(typeData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create product type');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Create product type error:', error);
      throw error;
    }
  }

  /**
   * Update product type (Admin only)
   */
  static async updateProductType(id: string, typeData: Partial<ProductType>): Promise<ProductType> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl(`/product-types/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(typeData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product type');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Update product type error:', error);
      throw error;
    }
  }

  /**
   * Delete product type (Admin only)
   */
  static async deleteProductType(id: string): Promise<void> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl(`/product-types/${id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product type');
      }
    } catch (error) {
      console.error('Delete product type error:', error);
      throw error;
    }
  }
}

export default ProductTypeService;
export type { ProductType, ProductTypeAttribute };
