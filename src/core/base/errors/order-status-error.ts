import { BusinessRuleError } from './business-rule-error.js';

export class OrderStatusError extends BusinessRuleError {
  constructor(message: string) {
    super(message);
  }
}
