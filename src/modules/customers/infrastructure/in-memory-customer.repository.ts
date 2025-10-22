import { injectable } from 'inversify';

import { Customer } from '../domain/customer.entity.js';
import { CustomerRepository } from '../application/repositories/customer-repository.interface.js';

@injectable()
export class InMemoryCustomerRepository implements CustomerRepository {
  private customers: Customer[] = [];

  public async save(customer: Customer): Promise<void> {
    const index = this.customers.findIndex(c => c.id === customer.id);
    if (index >= 0) {
      this.customers[index] = customer;
    } else {
      this.customers.push(customer);
    }
  }

  public async findById(id: string): Promise<Customer | null> {
    return this.customers.find(c => c.id === id) || null;
  }

  public async findByEmail(email: string): Promise<Customer | null> {
    return this.customers.find(c => c.email.rawValue === email) || null;
  }

  public async findAll(): Promise<Customer[]> {
    return [...this.customers];
  }
}
