import { Container } from 'inversify';

import { InjectionKeys } from '../../core/ioc/injection-keys.js';
import { CreateCustomerUseCase } from './application/usecases/create-customer.usecase.js';
import { GetAllCustomersUseCase } from './application/usecases/get-all-customers.usecase.js';
import { GetCustomerByIdUseCase } from './application/usecases/get-customer-by-id.usecase.js';
import { GetCustomerOrdersUseCase } from './application/usecases/get-customer-orders.usecase.js';
import { CustomerRepository } from './application/repositories/customer-repository.interface.js';
import { InMemoryCustomerRepository } from './infrastructure/in-memory-customer.repository.js';
import { CustomersController } from './presentation/customers.controller.js';

export default function customersBindings(container: Container): void {
  container
    .bind(InjectionKeys.CreateCustomerUseCase)
    .to(CreateCustomerUseCase)
    .inSingletonScope();

  container
    .bind(InjectionKeys.GetAllCustomersUseCase)
    .to(GetAllCustomersUseCase)
    .inSingletonScope();

  container
    .bind(InjectionKeys.GetCustomerByIdUseCase)
    .to(GetCustomerByIdUseCase)
    .inSingletonScope();

  container
    .bind(InjectionKeys.GetCustomerOrdersUseCase)
    .to(GetCustomerOrdersUseCase)
    .inSingletonScope();

  container
    .bind(InjectionKeys.CustomersController)
    .to(CustomersController)
    .inSingletonScope();

  container
    .bind<CustomerRepository>(InjectionKeys.CustomerRepository)
    .to(InMemoryCustomerRepository)
    .inSingletonScope();
}
