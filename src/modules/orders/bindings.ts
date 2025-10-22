import { Container } from 'inversify';
import { InjectionKeys } from '../../core/ioc/injection-keys.js';
import { CreateOrderUseCase } from './application/usecases/create-order.usecase.js';
import { GetAllOrdersUseCase } from './application/usecases/get-all-orders.usecase.js';
import { GetOrderByIdUseCase } from './application/usecases/get-order-by-id.usecase.js';
import { ConfirmOrderUseCase } from './application/usecases/confirm-order.usecase.js';
import { ShipOrderUseCase } from './application/usecases/ship-order-usecase.js';
import { CancelOrderUseCase } from './application/usecases/cancel-order-usecase.js';
import { OrderRepository } from './application/repositories/order-repository.interface.js';
import { InMemoryOrderRepository } from './infrastructure/in-memory-order.repository.js';
import { OrdersController } from './presentation/orders.controller.js';

export default function ordersBindings(container: Container): void {
  container
    .bind(InjectionKeys.CreateOrderUseCase)
    .to(CreateOrderUseCase)
    .inSingletonScope();

  container
    .bind(InjectionKeys.GetAllOrdersUseCase)
    .to(GetAllOrdersUseCase)
    .inSingletonScope();

  container
    .bind(InjectionKeys.GetOrderByIdUseCase)
    .to(GetOrderByIdUseCase)
    .inSingletonScope();

  container
    .bind(InjectionKeys.ConfirmOrderUseCase)
    .to(ConfirmOrderUseCase)
    .inSingletonScope();

  container
    .bind(InjectionKeys.ShipOrderUseCase)
    .to(ShipOrderUseCase)
    .inSingletonScope();

  container
    .bind(InjectionKeys.CancelOrderUseCase)
    .to(CancelOrderUseCase)
    .inSingletonScope();

  container
    .bind(InjectionKeys.OrdersController)
    .to(OrdersController)
    .inSingletonScope();

  container
    .bind<OrderRepository>(InjectionKeys.OrderRepository)
    .to(InMemoryOrderRepository)
    .inSingletonScope();
}
