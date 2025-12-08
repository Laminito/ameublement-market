import { getApiUrl } from './api';
import AuthService from './authService';
import type { Order } from '@/types/order';

interface CreateOrderPayload {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: 'kredika' | 'card' | 'transfer';
  installments?: number;
}

interface OrderListResponse {
  success: boolean;
  data: Order[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

interface OrderResponse {
  success: boolean;
  data: Order;
}

class OrderService {
  /**
   * Normalise les statuts de commande du backend au format frontend
   */
  private static normalizeOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'PENDING',
      'processing': 'PROCESSING',
      'confirmed': 'PROCESSING',
      'in_transit': 'IN_TRANSIT',
      'out_for_delivery': 'OUT_FOR_DELIVERY',
      'delivered': 'DELIVERED',
      'cancelled': 'CANCELLED',
    };
    return statusMap[status?.toLowerCase()] || status?.toUpperCase() || 'PENDING';
  }

  /**
   * Normalise les statuts de paiement du backend au format frontend
   */
  private static normalizePaymentStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'PENDING',
      'paid': 'PAID',
      'partially_paid': 'PARTIALLY_PAID',
      'failed': 'FAILED',
    };
    return statusMap[status?.toLowerCase()] || status?.toUpperCase() || 'PENDING';
  }

  /**
   * Get all user orders
   */
  static async getUserOrders(page: number = 1, limit: number = 10): Promise<{ orders: Order[]; pagination: any }> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const url = `${getApiUrl('/orders')}?page=${page}&limit=${limit}`;
      console.log('Fetching orders from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Orders response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Orders API error:', errorText);
        throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
      }

      const data: OrderListResponse = await response.json();
      console.log('Orders data received:', data);
      
      // Normaliser les statuts au format attendu
      const normalizedOrders = (data.data || []).map(order => ({
        ...order,
        status: OrderService.normalizeOrderStatus(order.status) as any,
        paymentStatus: OrderService.normalizePaymentStatus(order.payment?.status || order.paymentStatus) as any,
      }));
      
      return {
        orders: normalizedOrders,
        pagination: data.pagination || { currentPage: page, totalPages: 1, totalItems: 0 },
      };
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(id: string): Promise<Order> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl(`/orders/${id}`), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Order not found');
      }

      const data: OrderResponse = await response.json();
      const order = data.data;
      
      // Normalize status
      return {
        ...order,
        status: OrderService.normalizeOrderStatus(order.status) as any,
        paymentStatus: OrderService.normalizePaymentStatus(order.payment?.status || order.paymentStatus) as any,
      };
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  }

  /**
   * Create a new order
   */
  static async createOrder(payload: CreateOrderPayload): Promise<{ order: Order; paymentUrl?: string }> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl('/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }

      const data = await response.json();
      return {
        order: data.data || data.order,
        paymentUrl: data.paymentUrl,
      };
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  /**
   * Cancel an order
   */
  static async cancelOrder(id: string, reason?: string): Promise<Order> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl(`/orders/${id}/cancel`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      const data: OrderResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }

  /**
   * Get Kredika installment options
   */
  static async getKredikaInstallments(amount: number): Promise<Array<{ months: number; monthlyPayment: number }>> {
    try {
      const response = await fetch(getApiUrl(`/orders/kredika/installments?amount=${amount}`), {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch installment options');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Get installments error:', error);
      throw error;
    }
  }

  /**
   * Get order tracking information
   */
  static async getOrderTracking(id: string): Promise<any> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl(`/orders/${id}/tracking`), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tracking information');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get tracking error:', error);
      throw error;
    }
  }

  /**
   * Download order invoice
   */
  static async downloadInvoice(id: string): Promise<Blob> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(getApiUrl(`/orders/${id}/invoice`), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      return await response.blob();
    } catch (error) {
      console.error('Download invoice error:', error);
      throw error;
    }
  }
}

export default OrderService;
