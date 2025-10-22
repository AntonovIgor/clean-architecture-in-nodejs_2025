import { validateSync } from 'class-validator';

import { ValidationError } from './errors/validation-error.js';


export abstract class ValueObject<T> {
  protected readonly value: T;

  protected constructor(value: T) {
    this.value = Object.freeze(value);

  }

  protected validate(): void {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new ValidationError('ValueObject validation failed', errors.map(e => e.toString()));
    }
  }

  get rawValue(): T {
    return this.value;
  }

  equals(other: ValueObject<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }

  abstract toString(): string;
}
