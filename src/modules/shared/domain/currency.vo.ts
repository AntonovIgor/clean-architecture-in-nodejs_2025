import { IsNotEmpty, Length, Matches } from 'class-validator';

import { ValueObject } from '../../../core/base/base-value-object.js';

export class Currency extends ValueObject<string> {
  @IsNotEmpty()
  @Length(3, 3, { message: 'Currency must be 3-letter code' })
  @Matches(/^[A-Z]{3}$/, { message: 'Currency must be uppercase letters' })
  private readonly _value: string;

  private constructor(value: string) {
    super(value.toUpperCase());
    this._value = value.toUpperCase();
    this.validate();
  }

  get rawValue(): string {
    return this._value;
  }

  static create(value: string): Currency {
    return new Currency(value);
  }

  public toString(): string {
    return this.rawValue;
  }
}
