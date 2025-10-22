import { Currency } from '../../shared/domain/currency.vo.js';
import { Email } from '../../shared/domain/email.vo.js';
import { Money } from '../../shared/domain/money.vo.js';
import { Quantity } from '../../shared/domain/quantity.vo.js';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: Money;
  quantity: Quantity;
  total: Money;
}

export interface OrderProps {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: Email;
  items: OrderItem[];
  totalAmount: Money;
  currency: Currency;
  status: OrderStatus;
  createdAt: Date;
  updatedAt?: Date;
}
