import { BusinessRuleError } from './business-rule-error.js';

export class CurrencyMismatchError extends BusinessRuleError {
  constructor() {
    super('All items must have the same currency');
  }
}
