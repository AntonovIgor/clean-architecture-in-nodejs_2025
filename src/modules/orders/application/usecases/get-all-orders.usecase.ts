import { injectable, inject } from 'inversify';
import { InjectionKeys } from '../../../../core/ioc/injection-keys.js';
import { Order } from '../../domain/order.entity.js';
import { OrderRepository } from '../repositories/order-repository.interface.js';

@injectable()
export class GetAllOrdersUseCase {
  constructor(@inject(InjectionKeys.OrderRepository) private repo: OrderRepository) {}

  public async execute(): Promise<Order[]> {
    return this.repo.findAll();
  }
}
