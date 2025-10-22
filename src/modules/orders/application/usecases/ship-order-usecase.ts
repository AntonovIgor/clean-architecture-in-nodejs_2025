import { injectable, inject } from 'inversify';

import { InjectionKeys } from '../../../../core/ioc/injection-keys.js';
import { Order } from '../../domain/order.entity.js';
import { OrderRepository } from '../repositories/order-repository.interface.js';
import { NotFoundError } from '../../../../core/base/errors/not-found-error.js';

@injectable()
export class ShipOrderUseCase {
  constructor(@inject(InjectionKeys.OrderRepository) private repo: OrderRepository) {}

  public async execute(id: string): Promise<Order> {
    const order = await this.repo.findById(id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const shippedOrder = order.ship();
    await this.repo.save(shippedOrder);

    return shippedOrder;
  }
}
