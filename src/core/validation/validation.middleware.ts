import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

import { ValidationError } from '../base/errors/validation-error.js';

export function ValidationMiddleware<T extends object>(dtoClass: new () => T) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors.map(e => e.toString()));
    }
    req.body = dto;
    next();
  };
}
