import { Customer } from '../../domain/customer.entity.js';

export interface CustomerRepository {
  save(customer: Customer): Promise<void>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
}
