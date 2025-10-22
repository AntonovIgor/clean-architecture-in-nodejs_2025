import { IsInt, Min, Max } from 'class-validator';

import { ValueObject } from '../../../core/base/base-value-object.js';

export class Quantity extends ValueObject<number> {
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(1000, { message: 'Quantity cannot exceed 1000' })
  private readonly _value: number;

  private constructor(value: number) {
    super(Math.floor(value));
    this._value = Math.floor(value);
    this.validate();
  }

  static create(value: number): Quantity {
   return new Quantity(value);
  }

  get rawValue(): number {
   return this._value;
  }

  public toString(): string {
    return this.rawValue.toString();
  }
}
