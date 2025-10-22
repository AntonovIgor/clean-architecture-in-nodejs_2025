import { injectable, inject } from 'inversify';

import { InjectionKeys } from '../../../../core/ioc/injection-keys.js';
import { Order } from '../../domain/order.entity.js';
import { OrderRepository } from '../repositories/order-repository.interface.js';
import { ProductRepository } from '../../../products/application/repositories/product-repository.interface.js';
import { NotFoundError } from '../../../../core/base/errors/not-found-error.js';

@injectable()
export class CancelOrderUseCase {
  constructor(
    @inject(InjectionKeys.OrderRepository) private orderRepo: OrderRepository,
    @inject(InjectionKeys.ProductRepository) private productRepo: ProductRepository
  ) {}

  public async execute(id: string): Promise<Order> {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const cancelledOrder = order.cancel();

    for (const item of cancelledOrder.items) {
      const product = await this.productRepo.findById(item.productId);
      if (product) {
        const updatedProduct = product.increaseStock(item.quantity.rawValue);
        await this.productRepo.save(updatedProduct);
      }
    }

    await this.orderRepo.save(cancelledOrder);
    return cancelledOrder;
  }
}
