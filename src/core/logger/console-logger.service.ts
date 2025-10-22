import { injectable } from 'inversify';

import { Logger } from './logger.interface.js';

@injectable()
export class ConsoleLogger implements Logger {
  public info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  public error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`, error);
  }

  public debug(message: string, error?: unknown): void {
    console.debug(`[DEBUG] ${message}`, error);
  }
}
