export type PaymentMethod = 'CASH' | 'CREDIT';
export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'FAILED';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface Address {
  street: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  assemblyFee: number;
  tax: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress: Address;
  deliveryDate?: Date;
  deliveryTime?: string;
  assemblyService: boolean;
  specialInstructions?: string;
  status: OrderStatus;
  creditReservationId?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
