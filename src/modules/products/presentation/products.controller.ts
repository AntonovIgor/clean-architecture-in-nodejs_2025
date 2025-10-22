import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { InjectionKeys } from '../../../core/ioc/injection-keys.js';
import { BaseController } from '../../../core/base/base-controller.js';
import { CreateProductUseCase } from '../application/usecases/create-product.usecase.js';
import { GetAllProductsUseCase } from '../application/usecases/get-all-products.usecase.js';
import { GetProductByIdUseCase } from '../application/usecases/get-product-by-id.usecase.js';
import { ValidationMiddleware } from '../../../core/validation/validation.middleware.js';
import { CreateProductDto } from '../application/dto/create-product.dto.js';

@injectable()
export class ProductsController extends BaseController {
  constructor(
    @inject(InjectionKeys.CreateProductUseCase) private createUseCase: CreateProductUseCase,
    @inject(InjectionKeys.GetAllProductsUseCase) private getAllUseCase: GetAllProductsUseCase,
    @inject(InjectionKeys.GetProductByIdUseCase) private getByIdUseCase: GetProductByIdUseCase
  ) {
    super();

    this.addRoute({
      path: '/',
      method: 'post',
      handler: this.create.bind(this),
      middlewares: [ValidationMiddleware(CreateProductDto)]
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
  }

  private async create(req: Request, res: Response): Promise<void> {
    const product = await this.createUseCase.execute(req.body);
    this.sendCreated(res, product);
  }

  private async getAll(_req: Request, res: Response): Promise<void> {
    const products = await this.getAllUseCase.execute();
    this.sendSuccess(res, products);
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const product = await this.getByIdUseCase.execute(req.params.id);
    this.sendSuccess(res, product);
  }
}
