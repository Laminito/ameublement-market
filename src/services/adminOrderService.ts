import { getApiUrl } from './api';
import AuthService from './authService';
import type { Order } from '@/types/order';

interface AdminOrderListResponse {
  success: boolean;
  data: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

interface AdminOrderResponse {
  success: boolean;
  data: Order;
}

class AdminOrderService {
  /**
   * Get all orders (admin only)
   */
  static async getAllOrders(page: number = 1, limit: number = 10, status?: string): Promise<{ orders: Order[]; pagination: any }> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      let url = getApiUrl(`/admin/orders?page=${page}&limit=${limit}`);
      if (status) {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data: AdminOrderListResponse = await response.json();
      return {
        orders: data.data || [],
        pagination: data.pagination,
      };
    } catch (error) {
      console.error('Get all orders error:', error);
      throw error;
    }
  }

  /**
   * Update order status (admin only)
   */
  static async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl(`/admin/orders/${orderId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const data: AdminOrderResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }

  /**
   * Update payment status (admin only)
   */
  static async updatePaymentStatus(orderId: string, paymentStatus: string): Promise<Order> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl(`/admin/orders/${orderId}/payment-status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      const data: AdminOrderResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Update payment status error:', error);
      throw error;
    }
  }

  /**
   * Delete order (admin only)
   */
  static async deleteOrder(orderId: string): Promise<void> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl(`/admin/orders/${orderId}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
    } catch (error) {
      console.error('Delete order error:', error);
      throw error;
    }
  }

  /**
   * Assign tracking number (admin only)
   */
  static async assignTrackingNumber(orderId: string, trackingNumber: string): Promise<Order> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl(`/admin/orders/${orderId}/tracking`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trackingNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign tracking number');
      }

      const data: AdminOrderResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Assign tracking error:', error);
      throw error;
    }
  }

  /**
   * Get order analytics (admin only)
   */
  static async getOrderAnalytics(): Promise<any> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl('/admin/orders/analytics/summary'), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }

  /**
   * Export orders (admin only)
   */
  static async exportOrders(format: 'csv' | 'pdf' = 'csv'): Promise<Blob> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl(`/admin/orders/export?format=${format}`), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export orders');
      }

      return await response.blob();
    } catch (error) {
      console.error('Export orders error:', error);
      throw error;
    }
  }
}

export default AdminOrderService;
