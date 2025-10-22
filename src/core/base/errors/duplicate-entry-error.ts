import { BusinessRuleError } from './business-rule-error.js';

export class DuplicateEntryError extends BusinessRuleError {
  constructor(field: string) {
    super(`Duplicate entry for ${field}`);
  }
}
