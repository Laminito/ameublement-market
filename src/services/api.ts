/**
 * API Configuration
 * Central place for API endpoint management
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    VERIFY: '/auth/verify',
    GET_ME: '/auth/me',
  },
  
  // Users
  USERS: {
    PROFILE_ME: '/users/profile/me',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    AVATAR_ME: '/users/avatar/me',
    GET_USER: '/users/:id',
  },
  
  // Products
  PRODUCTS: {
    GET_ALL: '/products',
    GET_ONE: '/products/:id',
    GET_FEATURED: '/products?featured=true',
    GET_BY_CATEGORY: '/products?category=:category',
    SEARCH: '/products/search',
    GET_REVIEWS: '/products/:id/reviews',
    ADD_REVIEW: '/products/:id/reviews',
  },
  
  // Orders
  ORDERS: {
    CREATE: '/orders',
    GET_ALL: '/orders',
    GET_ONE: '/orders/:id',
    GET_KREDIKA_INSTALLMENTS: '/orders/kredika/installments',
    GET_KREDIKA_PAYMENT_PLAN: '/orders/:id/kredika',
  },
  
  // Uploads
  UPLOADS: {
    AVATAR: '/uploads/avatar',
    IMAGE: '/uploads/image',
  },
  
  // Favorites
  FAVORITES: {
    ADD: '/favorites/:productId',
    REMOVE: '/favorites/:productId',
    GET_ALL: '/users/favorites',
  },
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_BASE_URL;
