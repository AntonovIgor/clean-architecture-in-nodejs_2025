import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { InjectionKeys } from '../../../core/ioc/injection-keys.js';
import { BaseController } from '../../../core/base/base-controller.js';
import { CreateCustomerUseCase } from '../application/usecases/create-customer.usecase.js';
import { GetAllCustomersUseCase } from '../application/usecases/get-all-customers.usecase.js';
import { GetCustomerByIdUseCase } from '../application/usecases/get-customer-by-id.usecase.js';
import { GetCustomerOrdersUseCase } from '../application/usecases/get-customer-orders.usecase.js';
import { ValidationMiddleware } from '../../../core/validation/validation.middleware.js';
import { CreateCustomerDto } from '../application/dto/create-customer.dto.js';

@injectable()
export class CustomersController extends BaseController {
  constructor(
    @inject(InjectionKeys.CreateCustomerUseCase) private createUseCase: CreateCustomerUseCase,
    @inject(InjectionKeys.GetAllCustomersUseCase) private getAllUseCase: GetAllCustomersUseCase,
    @inject(InjectionKeys.GetCustomerByIdUseCase) private getByIdUseCase: GetCustomerByIdUseCase,
    @inject(InjectionKeys.GetCustomerOrdersUseCase) private getOrdersUseCase: GetCustomerOrdersUseCase
  ) {
    super();

    // Регистрация маршрутов
    this.addRoute({
      path: '/',
      method: 'post',
      handler: this.create.bind(this),
      middlewares: [ValidationMiddleware(CreateCustomerDto)]
    });

    this.addRoute({
      path: '/',
      method: 'get',
      handler: this.getAll.bind(this)
    });

    this.addRoute({
      path: '/:id',
      method: 'get',
      handler: this.getById.bind(this)
    });

    this.addRoute({
      path: '/:id/orders',
      method: 'get',
      handler: this.getOrders.bind(this)
    });
  }

  private async create(req: Request, res: Response): Promise<void> {
    const customer = await this.createUseCase.execute(req.body);
    this.sendCreated(res, customer);
  }

  private async getAll(_req: Request, res: Response): Promise<void> {
    const customers = await this.getAllUseCase.execute();
    this.sendSuccess(res, customers);
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const customer = await this.getByIdUseCase.execute(req.params.id);
    this.sendSuccess(res, customer);
  }

  private async getOrders(req: Request, res: Response): Promise<void> {
    const orders = await this.getOrdersUseCase.execute(req.params.id);
    this.sendSuccess(res, orders);
  }
}
