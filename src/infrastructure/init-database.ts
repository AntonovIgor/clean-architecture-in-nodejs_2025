import { randomUUID } from 'node:crypto';

import { container } from '../core/ioc/container.js';
import { InjectionKeys } from '../core/ioc/injection-keys.js';
import { Logger } from '../core/logger/logger.interface.js';
import { Customer } from '../modules/customers/domain/customer.entity.js';
import { CustomerRepository } from '../modules/customers/application/repositories/customer-repository.interface.js';
import { Product } from '../modules/products/domain/product.entity.js';
import { ProductRepository } from '../modules/products/application/repositories/product-repository.interface.js';

export default async function initDatabase(): Promise<void> {
  const logger = container.get<Logger>(InjectionKeys.Logger);
  const customerRepo = container.get<CustomerRepository>(InjectionKeys.CustomerRepository);
  const productRepo = container.get<ProductRepository>(InjectionKeys.ProductRepository);

  // Создание тестового клиента
  const customer = Customer.create({
    id: randomUUID(),
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    createdAt: new Date()
  });
  await customerRepo.save(customer);

  // Создание тестовых продуктов
  const product1 = Product.create({
    id: randomUUID(),
    name: 'Ноутбук',
    price: 50000,
    currency: 'RUB',
    stock: 10,
    createdAt: new Date()
  });

  const product2 = Product.create({
    id: randomUUID(),
    name: 'Мышь',
    price: 1500,
    currency: 'RUB',
    stock: 50,
    createdAt: new Date()
  });

  await productRepo.save(product1);
  await productRepo.save(product2);

  logger.info('Test data initialized');
  logger.info(`Customer ID: ${customer.id}`);
  logger.info(`Product 1 ID: ${product1.id}`);
  logger.info(`Product 2 ID: ${product2.id}`);
}
