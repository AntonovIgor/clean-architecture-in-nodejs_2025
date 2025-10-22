import { injectable, inject } from 'inversify';
import { randomUUID } from 'node:crypto';

import { InjectionKeys } from '../../../../core/ioc/injection-keys.js';
import { Order } from '../../domain/order.entity.js';
import { OrderStatus } from '../../domain/order.types.js';
import { OrderRepository } from '../repositories/order-repository.interface.js';
import { CreateOrderDto } from '../dto/create-order.dto.js';
import { CustomerRepository } from '../../../customers/application/repositories/customer-repository.interface.js';
import { ProductRepository } from '../../../products/application/repositories/product-repository.interface.js';
import { NotFoundError } from '../../../../core/base/errors/not-found-error.js';
import { InsufficientStockError } from '../../../../core/base/errors/insufficient-stock-error.js';
import { CurrencyMismatchError } from '../../../../core/base/errors/currency-mismatch-error.js';

@injectable()
export class CreateOrderUseCase {
  constructor(
    @inject(InjectionKeys.OrderRepository) private orderRepo: OrderRepository,
    @inject(InjectionKeys.CustomerRepository) private customerRepo: CustomerRepository,
    @inject(InjectionKeys.ProductRepository) private productRepo: ProductRepository
  ) {}

  public async execute(dto: CreateOrderDto): Promise<Order> {
    const customer = await this.customerRepo.findById(dto.customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const items = [];
    let currency = null;

    for (const item of dto.items) {
      const product = await this.productRepo.findById(item.productId);
      if (!product) {
        throw new NotFoundError(`Product ${item.productId} not found`);
      }

      if (product.stock.rawValue < item.quantity) {
        throw new InsufficientStockError({ available: product.stock.rawValue, requested: item.quantity });
      }

      if (currency === null) {
        currency = product.currency;
      } else if (!currency.equals(product.currency)) {
        throw new CurrencyMismatchError();
      }

      const updatedProduct = product.decreaseStock(item.quantity);
      await this.productRepo.save(updatedProduct);

      items.push({
        productId: product.id,
        productName: product.name,
        price: product.price.rawValue.amount,
        currency: product.currency.rawValue,
        quantity: item.quantity
      });
    }

    const order = Order.create({
      id: randomUUID(),
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email.rawValue,
      items,
      status: OrderStatus.PENDING,
      createdAt: new Date()
    });

    await this.orderRepo.save(order);
    return order;
  }
}
