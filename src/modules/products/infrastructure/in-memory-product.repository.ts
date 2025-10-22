import { injectable } from 'inversify';

import { Product } from '../domain/product.entity.js';
import { ProductRepository } from '../application/repositories/product-repository.interface.js';

@injectable()
export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = [];

  async save(product: Product): Promise<void> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      this.products[index] = product;
    } else {
      this.products.push(product);
    }
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }
}
