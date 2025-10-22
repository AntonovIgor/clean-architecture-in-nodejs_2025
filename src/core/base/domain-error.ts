export class DomainError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
