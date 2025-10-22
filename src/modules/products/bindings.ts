import { Container } from 'inversify';

import { InjectionKeys } from '../../core/ioc/injection-keys.js';
import { CreateProductUseCase } from './application/usecases/create-product.usecase.js';
import { GetAllProductsUseCase } from './application/usecases/get-all-products.usecase.js';
import { GetProductByIdUseCase } from './application/usecases/get-product-by-id.usecase.js';
import { ProductRepository } from './application/repositories/product-repository.interface.js';
import { InMemoryProductRepository } from './infrastructure/in-memory-product.repository.js';
import { ProductsController } from './presentation/products.controller.js';

export default function productsBindings(container: Container): void {
  container
    .bind(InjectionKeys.CreateProductUseCase)
    .to(CreateProductUseCase)
    .inSingletonScope();

  container
    .bind(InjectionKeys.GetAllProductsUseCase)
    .to(GetAllProductsUseCase)
    .inSingletonScope();

  container
    .bind(InjectionKeys.GetProductByIdUseCase)
    .to(GetProductByIdUseCase)
    .inSingletonScope();

  container
    .bind(InjectionKeys.ProductsController)
    .to(ProductsController)
    .inSingletonScope();

  container
    .bind<ProductRepository>(InjectionKeys.ProductRepository)
    .to(InMemoryProductRepository)
    .inSingletonScope();
}
