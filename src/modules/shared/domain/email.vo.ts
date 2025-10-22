import { IsEmail } from 'class-validator';

import { ValueObject } from '../../../core/base/base-value-object.js';

export class Email extends ValueObject<string> {
  @IsEmail({}, { message: 'Invalid email format' })
  private readonly _value: string;

  private constructor(value: string) {
    super(value.toLowerCase().trim());
    this._value = value.toLowerCase().trim();
    this.validate();
  }

  static create(value: string): Email {
    return new Email(value);
  }

  get rawValue(): string {
    return this._value;
  }

  public toString(): string {
    return this.rawValue;
  }
}
