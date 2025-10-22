import { Order } from '../../domain/order.entity.js';

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  findByCustomerId(customerId: string): Promise<Order[]>;
}
