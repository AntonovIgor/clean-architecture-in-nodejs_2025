import { IsNumber, Min } from 'class-validator';

import { ValueObject } from '../../../core/base/base-value-object.js';
import { Currency } from './currency.vo.js';
import { ValidationError } from '../../../core/base/errors/validation-error.js';

interface MoneyProps {
  amount: number;
  currency: Currency;
}

export class Money extends ValueObject<MoneyProps> {
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0, { message: 'Amount cannot be negative' })
  private readonly _amount: number;

  private readonly _currency: Currency;

  private constructor(props: MoneyProps) {
    super(props);
    this._amount = props.amount;
    this._currency = props.currency;
    this.validate();
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): Currency {
    return this._currency;
  }

  static create(amount: number, currency: string | Currency): Money {
    const curr = typeof currency === 'string' ? Currency.create(currency) : currency;
    return new Money({ amount, currency: curr });
  }

  get rawValue(): MoneyProps {
    return { amount: this._amount, currency: this._currency };
  }

  public add(other: Money): Money {
    if (!this._currency.equals(other._currency)) {
      throw new ValidationError('Currencies must match for addition');
    }
    return Money.create(this._amount + other._amount, this._currency);
  }

  public multiply(quantity: number): Money {
    if (quantity < 0) {
      throw new ValidationError('Multiplier cannot be negative');
    }

    return Money.create(this._amount * quantity, this._currency);
  }

  public toString(): string {
    return `${this._amount.toFixed(2)} ${this._currency.rawValue}`;
  }
}
