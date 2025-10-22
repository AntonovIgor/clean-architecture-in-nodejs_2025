import { Container } from 'inversify';

import { InjectionKeys } from './injection-keys.js';
import { Logger } from '../logger/logger.interface.js';
import { ConsoleLogger } from '../logger/console-logger.service.js';
import { ExceptionFilter } from '../exception/exception-filter.js';

const container = new Container();

container
  .bind<Logger>(InjectionKeys.Logger)
  .to(ConsoleLogger)
  .inSingletonScope();

container
  .bind<ExceptionFilter>(InjectionKeys.ExceptionFilter)
  .to(ExceptionFilter)
  .inSingletonScope();

export { container };
