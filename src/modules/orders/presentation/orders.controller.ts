import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { InjectionKeys } from '../../../core/ioc/injection-keys.js';
import { BaseController } from '../../../core/base/base-controller.js';
import { CreateOrderUseCase } from '../application/usecases/create-order.usecase.js';
import { GetAllOrdersUseCase } from '../application/usecases/get-all-orders.usecase.js';
import { GetOrderByIdUseCase } from '../application/usecases/get-order-by-id.usecase.js';
import { ConfirmOrderUseCase } from '../application/usecases/confirm-order.usecase.js';
import { ShipOrderUseCase } from '../application/usecases/ship-order-usecase.js';
import { CancelOrderUseCase } from '../application/usecases/cancel-order-usecase.js';
import { ValidationMiddleware } from '../../../core/validation/validation.middleware.js';
import { CreateOrderDto } from '../application/dto/create-order.dto.js';

@injectable()
export class OrdersController extends BaseController {
  constructor(
    @inject(InjectionKeys.CreateOrderUseCase) private createUseCase: CreateOrderUseCase,
    @inject(InjectionKeys.GetAllOrdersUseCase) private getAllUseCase: GetAllOrdersUseCase,
    @inject(InjectionKeys.GetOrderByIdUseCase) private getByIdUseCase: GetOrderByIdUseCase,
    @inject(InjectionKeys.ConfirmOrderUseCase) private confirmUseCase: ConfirmOrderUseCase,
    @inject(InjectionKeys.ShipOrderUseCase) private shipUseCase: ShipOrderUseCase,
    @inject(InjectionKeys.CancelOrderUseCase) private cancelUseCase: CancelOrderUseCase
  ) {
    super();

    // Регистрация маршрутов
    this.addRoute({
      path: '/',
      method: 'post',
      handler: this.create.bind(this),
      middlewares: [ValidationMiddleware(CreateOrderDto)]
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
      path: '/:id/confirm',
      method: 'patch',
      handler: this.confirm.bind(this)
    });

    this.addRoute({
      path: '/:id/ship',
      method: 'patch',
      handler: this.ship.bind(this)
    });

    this.addRoute({
      path: '/:id/cancel',
      method: 'patch',
      handler: this.cancel.bind(this)
    });
  }

  private async create(req: Request, res: Response): Promise<void> {
    const order = await this.createUseCase.execute(req.body);
    this.sendCreated(res, order);
  }

  private async getAll(_req: Request, res: Response): Promise<void> {
    const orders = await this.getAllUseCase.execute();
    this.sendSuccess(res, orders);
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const order = await this.getByIdUseCase.execute(req.params.id);
    this.sendSuccess(res, order);
  }

  private async confirm(req: Request, res: Response): Promise<void> {
    const order = await this.confirmUseCase.execute(req.params.id);
    this.sendSuccess(res, order);
  }

  private async ship(req: Request, res: Response): Promise<void> {
    const order = await this.shipUseCase.execute(req.params.id);
    this.sendSuccess(res, order);
  }

  private async cancel(req: Request, res: Response): Promise<void> {
    const order = await this.cancelUseCase.execute(req.params.id);
    this.sendSuccess(res, order);
  }
}
