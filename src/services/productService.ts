/**
 * Product Service
 * Handles all product-related API calls
 */

import { API_ENDPOINTS, getApiUrl } from './api';

export interface ProductImage {
  url: string;
  publicId: string;
  alt: string;
  _id: string;
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: ProductCategory;
  images: ProductImage[];
  materials: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity: number;
  brand: string;
  sku: string;
  tags: string[];
  isActive: boolean;
  featured: boolean;
  rating: ProductRating;
  dimensions: ProductDimensions;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

class ProductService {
  /**
   * Get all products with pagination
   */
  static async getProducts(page: number = 1, limit: number = 12): Promise<ProductsResponse> {
    try {
      const url = `${getApiUrl(API_ENDPOINTS.PRODUCTS.GET_ALL)}?page=${page}&limit=${limit}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      return await response.json();
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(): Promise<ProductsResponse> {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.PRODUCTS.GET_FEATURED), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }

      return await response.json();
    } catch (error) {
      console.error('Get featured products error:', error);
      throw error;
    }
  }

  /**
   * Get single product by ID
   */
  static async getProductById(id: string): Promise<ProductResponse> {
    try {
      const url = getApiUrl(API_ENDPOINTS.PRODUCTS.GET_ONE.replace(':id', id));
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      return await response.json();
    } catch (error) {
      console.error('Get product by id error:', error);
      throw error;
    }
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(category: string): Promise<ProductsResponse> {
    try {
      const url = getApiUrl(API_ENDPOINTS.PRODUCTS.GET_BY_CATEGORY.replace(':category', category));
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products by category');
      }

      return await response.json();
    } catch (error) {
      console.error('Get products by category error:', error);
      throw error;
    }
  }

  /**
   * Search products
   */
  static async searchProducts(query: string): Promise<ProductsResponse> {
    try {
      const url = `${getApiUrl(API_ENDPOINTS.PRODUCTS.SEARCH)}?q=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search products');
      }

      return await response.json();
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }

  /**
   * Get product reviews
   */
  static async getProductReviews(productId: string): Promise<any> {
    try {
      const url = getApiUrl(API_ENDPOINTS.PRODUCTS.GET_REVIEWS.replace(':id', productId));
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      return await response.json();
    } catch (error) {
      console.error('Get reviews error:', error);
      throw error;
    }
  }

  /**
   * Add product review
   */
  static async addProductReview(productId: string, reviewData: any): Promise<any> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = getApiUrl(API_ENDPOINTS.PRODUCTS.ADD_REVIEW.replace(':id', productId));
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to add review');
      }

      return await response.json();
    } catch (error) {
      console.error('Add review error:', error);
      throw error;
    }
  }
}

export default ProductService;
