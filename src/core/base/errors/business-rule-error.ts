import { DomainError } from '../domain-error.js';

export class BusinessRuleError extends DomainError {
  constructor(message: string, details?: unknown) {
    super(message, 422, details); // Unprocessable Entity
  }
}
