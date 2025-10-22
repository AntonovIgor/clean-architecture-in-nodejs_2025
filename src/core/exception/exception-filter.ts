import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { DomainError } from '../base/domain-error.js';
import { ValidationError } from '../base/errors/validation-error.js';
import { NotFoundError } from '../base/errors/not-found-error.js';
import { BusinessRuleError } from '../base/errors/business-rule-error.js';
import { Logger } from '../logger/logger.interface.js';
import { InjectionKeys } from '../ioc/injection-keys.js';

@injectable()
export class ExceptionFilter {
  constructor(
    @inject(InjectionKeys.Logger) private readonly logger: Logger,
  ) {}

  public handler(err: Error, _req: Request, res: Response, next: NextFunction): void {
    if (err instanceof ValidationError) {
      res.status(err.status).json({ error: err.message, details: err.details });
      this.logger.error(`Validation error: ${err.message}`, err.details);
    } else if (err instanceof NotFoundError) {
      res.status(err.status).json({ error: err.message });
      this.logger.error(`Not found: ${err.message}`);
    } else if (err instanceof BusinessRuleError) {
      res.status(err.status).json({ error: err.message, details: err.details });
      this.logger.error(`Business rule violation: ${err.message}`, err.details);
    } else if (err instanceof DomainError) {
      res.status(err.status).json({ error: err.message, details: err.details });
      this.logger.error(`Domain error: ${err.message}`, err);
    } else {
      res.status(500).json({ error: 'Internal server error' });
      this.logger.error('Unhandled error', err);
    }
    next();
  }
}
