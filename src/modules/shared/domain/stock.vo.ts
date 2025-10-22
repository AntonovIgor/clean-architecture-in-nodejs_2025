import { IsInt, Min, Max } from 'class-validator';

import { ValueObject } from '../../../core/base/base-value-object.js';
import { ValidationError } from '../../../core/base/errors/validation-error.js';

export class Stock extends ValueObject<number> {
  @IsInt({ message: 'Stock must be an integer' })
  @Min(0, { message: 'Stock cannot be negative' })
  @Max(100000, { message: 'Stock cannot exceed 100000' })
  private readonly _value: number;

  private constructor(value: number) {
    super(Math.floor(value));
    this._value = Math.floor(value);
    this.validate();
  }

  static create(value: number): Stock {
    return new Stock(value);
  }

  get rawValue(): number {
    return this._value;
  }

  public decrease(by: number): Stock {
    if (by < 0) throw new ValidationError('Decrease amount cannot be negative');
    if (this.rawValue < by) throw new ValidationError('Insufficient stock');
    return Stock.create(this.rawValue - by);
  }

  public increase(by: number): Stock {
    if (by < 0) {
      throw new ValidationError('Increase amount cannot be negative');
    }

    return Stock.create(this.rawValue + by);
  }

  public toString(): string {
    return this.rawValue.toString();
  }
}
