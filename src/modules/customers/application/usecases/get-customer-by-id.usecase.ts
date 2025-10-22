import { injectable, inject } from 'inversify';

import { InjectionKeys } from '../../../../core/ioc/injection-keys.js';
import { Customer } from '../../domain/customer.entity.js';
import { CustomerRepository } from '../repositories/customer-repository.interface.js';
import { NotFoundError } from '../../../../core/base/errors/not-found-error.js';

@injectable()
export class GetCustomerByIdUseCase {
  constructor(@inject(InjectionKeys.CustomerRepository) private repo: CustomerRepository) {}

  async execute(id: string): Promise<Customer> {
    const customer = await this.repo.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    return customer;
  }
}
