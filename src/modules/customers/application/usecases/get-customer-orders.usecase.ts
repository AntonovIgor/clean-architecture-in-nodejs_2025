import { injectable, inject } from 'inversify';

import { InjectionKeys } from '../../../../core/ioc/injection-keys.js';
import { Order } from '../../../orders/domain/order.entity.js';
import { OrderRepository } from '../../../orders/application/repositories/order-repository.interface.js';
import { NotFoundError } from '../../../../core/base/errors/not-found-error.js';
import { CustomerRepository } from '../repositories/customer-repository.interface.js';

@injectable()
export class GetCustomerOrdersUseCase {
  constructor(
    @inject(InjectionKeys.CustomerRepository) private customerRepo: CustomerRepository,
    @inject(InjectionKeys.OrderRepository) private orderRepo: OrderRepository
  ) {}

  async execute(customerId: string): Promise<Order[]> {
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    return this.orderRepo.findByCustomerId(customerId);
  }
}
