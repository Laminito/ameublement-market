export type PaymentMethod = 'CASH' | 'CREDIT' | 'kredika' | 'card' | 'transfer';
export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'FAILED';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface Address {
  street: string;
  city: string;
  region?: string;
  postalCode?: string;
  country?: string;
  phone: string;
  firstName?: string;
  lastName?: string;
}

export interface OrderItem {
  productId?: string;
  productName?: string;
  product?: {
    _id: string;
    name: string;
    images?: Array<{ url: string }>;
  };
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  _id?: string;
  id?: string;
  orderNumber: string;
  customerId?: string;
  items: OrderItem[];
  subtotal?: number;
  deliveryFee?: number;
  assemblyFee?: number;
  tax?: number;
  totalAmount?: number;
  pricing?: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  payment?: {
    method: string;
    status: string;
    kredikaTransactionId?: string;
  };
  deliveryAddress: Address;
  shippingAddress?: Address;
  deliveryDate?: Date | string;
  deliveryTime?: string;
  assemblyService?: boolean;
  specialInstructions?: string;
  status: OrderStatus;
  creditReservationId?: string;
  trackingNumber?: string;
  tracking?: {
    trackingNumber: string;
    estimatedDelivery: string;
  };
  createdAt: Date | string;
  updatedAt?: Date | string;
}
