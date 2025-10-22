import { DomainError } from '../domain-error.js';

export class ValidationError extends DomainError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
  }
}
