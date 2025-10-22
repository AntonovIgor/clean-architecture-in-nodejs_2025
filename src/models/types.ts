export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  stock: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  currency: string;
  stock: number;
}

export interface CreateOrderRequest {
  customerId: string;
  items: CreateOrderItemRequest[];
}

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
}

export interface ApiError {
  error: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
}
