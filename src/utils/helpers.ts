export function validateEmail(email: string): boolean {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateCurrency(currency: string): boolean {
  return currency !== '' && currency.length === 3;
}

export function validatePositiveNumber(value: number): boolean {
  return typeof value === 'number' && value > 0;
}

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function formatMoney(amount: number, currency: string): string {
  return `${amount.toFixed(2)} ${currency}`;
}

// Типы для утилит
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmailWithResult(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!validateEmail(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
}

// 💀 Мёртвый код
export function calculateOrderTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}
