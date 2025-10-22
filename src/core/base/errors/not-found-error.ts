import { DomainError } from '../domain-error.js';

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message, 404);
  }
}
