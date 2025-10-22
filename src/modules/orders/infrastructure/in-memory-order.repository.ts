import { injectable } from 'inversify';
import { Order } from '../domain/order.entity.js';
import { OrderRepository } from '../application/repositories/order-repository.interface.js';

@injectable()
export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  public async save(order: Order): Promise<void> {
    const index = this.orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      this.orders[index] = order;
    } else {
      this.orders.push(order);
    }
  }

  public async findById(id: string): Promise<Order | null> {
    return this.orders.find(o => o.id === id) || null;
  }

  public async findAll(): Promise<Order[]> {
    return [...this.orders];
  }

  public async findByCustomerId(customerId: string): Promise<Order[]> {
    return this.orders.filter(o => o.customerId === customerId);
  }
}
