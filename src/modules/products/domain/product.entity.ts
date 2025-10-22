import { Length } from 'class-validator';

import { BaseEntity } from '../../../core/base/base-entity.js';
import { Money } from '../../shared/domain/money.vo.js';
import { Currency } from '../../shared/domain/currency.vo.js';
import { Stock } from '../../shared/domain/stock.vo.js';
import { InsufficientStockError } from '../../../core/base/errors/insufficient-stock-error.js';
import { ValidationError } from '../../../core/base/errors/validation-error.js';
import { ProductProps } from './product.types.js';

export class Product extends BaseEntity {
  readonly id: string;

  @Length(1, 200)
  readonly name: string;

  readonly price: Money;

  readonly currency: Currency;

  readonly stock: Stock;

  readonly createdAt: Date;
  readonly updatedAt?: Date;

  private constructor(props: ProductProps) {
    super();
    Object.assign(this, props);
  }

  static create(props: { id: string; name: string; price: number; currency: string | Currency; stock: number; createdAt: Date; updatedAt?: Date }): Product {
    const currencyVo = typeof props.currency === 'string' ? Currency.create(props.currency) : props.currency;
    const priceVo = Money.create(props.price, currencyVo);
    const stockVo = Stock.create(props.stock);
    const instance = new Product({ ...props, price: priceVo, currency: currencyVo, stock: stockVo });
    this.validate(instance);
    return instance;
  }

  public decreaseStock(quantity: number): Product {
    if (quantity < 0) {
      throw new ValidationError('Quantity cannot be negative');
    }

    if (this.stock.rawValue < quantity) {
      throw new InsufficientStockError({ available: this.stock.rawValue, requested: quantity });
    }

    const newStock = this.stock.decrease(quantity);
    return new Product({ ...this, stock: newStock, updatedAt: new Date() });
  }

  increaseStock(quantity: number): Product {
    if (quantity < 0) {
      throw new ValidationError('Quantity cannot be negative');
    }

    const newStock = this.stock.increase(quantity);
    return new Product({ ...this, stock: newStock, updatedAt: new Date() });
  }
}
