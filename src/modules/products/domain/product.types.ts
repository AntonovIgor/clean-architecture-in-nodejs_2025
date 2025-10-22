import { Money } from '../../shared/domain/money.vo.js';
import { Currency } from '../../shared/domain/currency.vo.js';
import { Stock } from '../../shared/domain/stock.vo.js';

export interface ProductProps {
  id: string;
  name: string;
  price: Money;
  currency: Currency;
  stock: Stock;
  createdAt: Date;
  updatedAt?: Date;
}
