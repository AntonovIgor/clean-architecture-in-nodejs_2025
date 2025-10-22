import { injectable, inject } from 'inversify';
import { InjectionKeys } from '../../../../core/ioc/injection-keys.js';
import { Product } from '../../domain/product.entity.js';
import { ProductRepository } from '../repositories/product-repository.interface.js';

@injectable()
export class GetAllProductsUseCase {
  constructor(@inject(InjectionKeys.ProductRepository) private repo: ProductRepository) {}

  public async execute(): Promise<Product[]> {
    return this.repo.findAll();
  }
}
