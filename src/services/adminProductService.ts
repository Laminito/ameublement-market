/**
 * Admin Product Service
 * Handles admin operations for product management (create, update, delete)
 */

import { getApiUrl } from './api';
import AuthService from './authService';
import ProductService from './productService';

export interface AdminProductPayload {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  sku: string;
  images: Array<{
    url?: string;
    file?: File;
    publicId: string;
    alt: string;
  }>;
  video?: {
    url: string;
    publicId: string;
    thumbnail: string;
    duration: number;
    fileSize: number;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  materials: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity: number;
  brand: string;
  tags: string[];
  featured: boolean;
  isActive: boolean;
}

class AdminProductService {
  /**
   * Create a new product
   * Supports both URL-based and file-based images
   */
  static async createProduct(payload: AdminProductPayload): Promise<any> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Check if we have file uploads
    const hasFileUploads = payload.images.some((img) => img.file);

    if (hasFileUploads) {
      // Use FormData for multipart upload
      const formData = new FormData();

      // Add basic fields
      formData.append('name', payload.name);
      formData.append('description', payload.description);
      formData.append('price', payload.price.toString());
      formData.append('originalPrice', payload.originalPrice.toString());
      formData.append('discount', payload.discount.toString());
      formData.append('category', payload.category);
      formData.append('sku', payload.sku);
      formData.append('inStock', payload.inStock.toString());
      formData.append('stockQuantity', payload.stockQuantity.toString());
      formData.append('brand', payload.brand);
      formData.append('featured', payload.featured.toString());
      formData.append('isActive', payload.isActive.toString());

      // Add dimensions
      formData.append('dimensions[length]', payload.dimensions.length.toString());
      formData.append('dimensions[width]', payload.dimensions.width.toString());
      formData.append('dimensions[height]', payload.dimensions.height.toString());
      formData.append('dimensions[weight]', payload.dimensions.weight.toString());

      // Add materials and colors
      payload.materials.forEach((material, index) => {
        formData.append(`materials[${index}]`, material);
      });
      payload.colors.forEach((color, index) => {
        formData.append(`colors[${index}]`, color);
      });
      payload.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });

      // Add images
      payload.images.forEach((img, index) => {
        if (img.file) {
          formData.append(`images[${index}][file]`, img.file);
          formData.append(`images[${index}][publicId]`, img.publicId);
          formData.append(`images[${index}][alt]`, img.alt);
        } else if (img.url) {
          formData.append(`images[${index}][url]`, img.url);
          formData.append(`images[${index}][publicId]`, img.publicId);
          formData.append(`images[${index}][alt]`, img.alt);
        }
      });

      // Add video if present
      if (payload.video) {
        formData.append('video[url]', payload.video.url);
        formData.append('video[publicId]', payload.video.publicId);
        formData.append('video[thumbnail]', payload.video.thumbnail);
        formData.append('video[duration]', payload.video.duration.toString());
        formData.append('video[fileSize]', payload.video.fileSize.toString());
      }

      const response = await fetch(getApiUrl('/admin/products'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
      }

      return await response.json();
    } else {
      // Use regular JSON for URL-only images
      const response = await fetch(getApiUrl('/admin/products'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
      }

      return await response.json();
    }
  }

  /**
   * Update an existing product
   */
  static async updateProduct(id: string, payload: Partial<AdminProductPayload>): Promise<any> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Check if we have file uploads
    const hasFileUploads = payload.images && payload.images.some((img) => img.file);

    if (hasFileUploads) {
      // Use FormData for multipart upload
      const formData = new FormData();

      // Add only fields that are provided
      if (payload.name) formData.append('name', payload.name);
      if (payload.description) formData.append('description', payload.description);
      if (payload.price !== undefined) formData.append('price', payload.price.toString());
      if (payload.originalPrice !== undefined) formData.append('originalPrice', payload.originalPrice.toString());
      if (payload.discount !== undefined) formData.append('discount', payload.discount.toString());
      if (payload.category) formData.append('category', payload.category);
      if (payload.sku) formData.append('sku', payload.sku);
      if (payload.inStock !== undefined) formData.append('inStock', payload.inStock.toString());
      if (payload.stockQuantity !== undefined) formData.append('stockQuantity', payload.stockQuantity.toString());
      if (payload.brand) formData.append('brand', payload.brand);
      if (payload.featured !== undefined) formData.append('featured', payload.featured.toString());
      if (payload.isActive !== undefined) formData.append('isActive', payload.isActive.toString());

      // Add dimensions
      if (payload.dimensions) {
        formData.append('dimensions[length]', payload.dimensions.length.toString());
        formData.append('dimensions[width]', payload.dimensions.width.toString());
        formData.append('dimensions[height]', payload.dimensions.height.toString());
        formData.append('dimensions[weight]', payload.dimensions.weight.toString());
      }

      // Add materials, colors, tags
      if (payload.materials) {
        payload.materials.forEach((material, index) => {
          formData.append(`materials[${index}]`, material);
        });
      }
      if (payload.colors) {
        payload.colors.forEach((color, index) => {
          formData.append(`colors[${index}]`, color);
        });
      }
      if (payload.tags) {
        payload.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }

      // Add images
      if (payload.images) {
        payload.images.forEach((img, index) => {
          if (img.file) {
            formData.append(`images[${index}][file]`, img.file);
            formData.append(`images[${index}][publicId]`, img.publicId);
            formData.append(`images[${index}][alt]`, img.alt);
          } else if (img.url) {
            formData.append(`images[${index}][url]`, img.url);
            formData.append(`images[${index}][publicId]`, img.publicId);
            formData.append(`images[${index}][alt]`, img.alt);
          }
        });
      }

      // Add video if present
      if (payload.video) {
        formData.append('video[url]', payload.video.url);
        formData.append('video[publicId]', payload.video.publicId);
        formData.append('video[thumbnail]', payload.video.thumbnail);
        formData.append('video[duration]', payload.video.duration.toString());
        formData.append('video[fileSize]', payload.video.fileSize.toString());
      }

      const response = await fetch(getApiUrl(`/admin/products/${id}`), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
      }

      return await response.json();
    } else {
      // Use regular JSON for URL-only images
      const response = await fetch(getApiUrl(`/admin/products/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
      }

      return await response.json();
    }
  }

  /**
   * Delete a product
   */
  static async deleteProduct(id: string): Promise<any> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(getApiUrl(`/admin/products/${id}`), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete product');
    }

    return await response.json();
  }

  /**
   * Get all products (for admin) - Uses the same endpoint as regular products
   */
  static async getAllProducts(page: number = 1, limit: number = 20): Promise<any> {
    try {
      // Utilise le même endpoint que ProductService pour récupérer les produits
      const response = await ProductService.getProducts(page, limit);
      return response;
    } catch (error) {
      console.error('Get all products error:', error);
      throw error;
    }
  }
}

export default AdminProductService;
