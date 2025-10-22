import { injectable, inject } from 'inversify';
import { InjectionKeys } from '../../../../core/ioc/injection-keys.js';
import { Product } from '../../domain/product.entity.js';
import { ProductRepository } from '../repositories/product-repository.interface.js';
import { NotFoundError } from '../../../../core/base/errors/not-found-error.js';

@injectable()
export class GetProductByIdUseCase {
  constructor(@inject(InjectionKeys.ProductRepository) private repo: ProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.repo.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return product;
  }
}
