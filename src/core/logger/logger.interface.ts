export interface Logger {
  info(message: string): void;
  error(message: string, error?: unknown): void;
  debug(message: string, error?: unknown): void;
}
