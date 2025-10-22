import { injectable, inject } from 'inversify';

import { InjectionKeys } from '../../../../core/ioc/injection-keys.js';
import { Customer } from '../../domain/customer.entity.js';
import { CustomerRepository } from '../repositories/customer-repository.interface.js';

@injectable()
export class GetAllCustomersUseCase {
  constructor(@inject(InjectionKeys.CustomerRepository) private repo: CustomerRepository) {}

  async execute(): Promise<Customer[]> {
    return this.repo.findAll();
  }
}
