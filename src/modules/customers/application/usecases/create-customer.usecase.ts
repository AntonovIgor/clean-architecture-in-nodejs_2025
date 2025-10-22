import { injectable, inject } from 'inversify';

import { randomUUID } from 'node:crypto';

import { InjectionKeys } from '../../../../core/ioc/injection-keys.js';
import { Customer } from '../../domain/customer.entity.js';
import { CustomerRepository } from '../repositories/customer-repository.interface.js';
import { CreateCustomerDto } from '../dto/create-customer.dto.js';
import { DuplicateEntryError } from '../../../../core/base/errors/duplicate-entry-error.js';

@injectable()
export class CreateCustomerUseCase {
  constructor(@inject(InjectionKeys.CustomerRepository) private repo: CustomerRepository) {}

  async execute(dto: CreateCustomerDto): Promise<Customer> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) {
      throw new DuplicateEntryError('email');
    }

    const customer = Customer.create({
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      createdAt: new Date()
    });

    await this.repo.save(customer);
    return customer;
  }
}
