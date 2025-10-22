import { validateSync } from 'class-validator';

import { ValidationError } from './errors/validation-error.js';

export abstract class BaseEntity {
  protected constructor() {}

  protected static validate<T extends BaseEntity>(instance: T): void {
    const errors = validateSync(instance);
    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors.map(e => e.toString()));
    }
  }
}
