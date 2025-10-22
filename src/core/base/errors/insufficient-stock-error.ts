import { BusinessRuleError } from './business-rule-error.js';

export class InsufficientStockError extends BusinessRuleError {
  constructor(details: { available: number; requested: number }) {
    super('Insufficient stock', details);
  }
}
