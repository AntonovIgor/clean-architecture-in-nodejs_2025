import { injectable, inject } from 'inversify';

import { randomUUID } from 'node:crypto';

import { InjectionKeys } from '../../../../core/ioc/injection-keys.js';
import { Product } from '../../domain/product.entity.js';
import { ProductRepository } from '../repositories/product-repository.interface.js';
import { CreateProductDto } from '../dto/create-product.dto.js';

@injectable()
export class CreateProductUseCase {
  constructor(@inject(InjectionKeys.ProductRepository) private repo: ProductRepository) {}

  public async execute(dto: CreateProductDto): Promise<Product> {

    const product = Product.create({
      id: randomUUID(),
      name: dto.name,
      price: dto.price,
      currency: dto.currency,
      stock: dto.stock,
      createdAt: new Date()
    });

    await this.repo.save(product);
    return product;
  }
}
