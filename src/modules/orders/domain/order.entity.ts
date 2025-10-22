import { IsEnum } from 'class-validator';

import { BaseEntity } from '../../../core/base/base-entity.js';
import { Money } from '../../shared/domain/money.vo.js';
import { Quantity } from '../../shared/domain/quantity.vo.js';
import { Currency } from '../../shared/domain/currency.vo.js';
import { Email } from '../../shared/domain/email.vo.js';
import { CurrencyMismatchError } from '../../../core/base/errors/currency-mismatch-error.js';
import { BusinessRuleError } from '../../../core/base/errors/business-rule-error.js';
import { OrderStatusError } from '../../../core/base/errors/order-status-error.js';
import { OrderItem, OrderProps, OrderStatus } from './order.types.js';


export class Order extends BaseEntity {
  readonly id: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly customerEmail: Email;
  readonly items: OrderItem[];
  readonly totalAmount: Money;
  readonly currency: Currency;

  @IsEnum(OrderStatus)
  readonly status: OrderStatus;

  readonly createdAt: Date;
  readonly updatedAt?: Date;

  private constructor(props: OrderProps) {
    super();
    Object.assign(this, props);
  }

  static create(props: {
    id: string;
    customerId: string;
    customerName: string;
    customerEmail: string | Email;
    items: Array<{ productId: string; productName: string; price: number; currency: string; quantity: number }>;
    status: OrderStatus;
    createdAt: Date;
    updatedAt?: Date;
  }): Order {
    const email = typeof props.customerEmail === 'string' ? Email.create(props.customerEmail) : props.customerEmail;

    const ordersItems: OrderItem[] = props.items.map(item => {
      const qtyVo = Quantity.create(item.quantity);
      const priceVo = Money.create(item.price, item.currency);
      const totalVo = priceVo.multiply(qtyVo.rawValue);
      return { productId: item.productId, productName: item.productName, price: priceVo, quantity: qtyVo, total: totalVo };
    });

    if (ordersItems.length === 0) {
      throw new BusinessRuleError('Order must have at least one item');
    }

    if (ordersItems.length > 50) {
      throw new BusinessRuleError('Order cannot have more than 50 items');
    }

    const firstCurrency = ordersItems[0].price.currency;
    if (ordersItems.some(i => !i.price.currency.equals(firstCurrency))) {
      throw new CurrencyMismatchError();
    }

    const calculatedTotal = ordersItems.reduce((sum, i) => sum.add(i.total), Money.create(0, firstCurrency));
    if (calculatedTotal.rawValue.amount > 5000000) {
      throw new BusinessRuleError('Order total too high');
    }

    const productIds = ordersItems.map(i => i.productId);
    if (new Set(productIds).size !== productIds.length) {
      throw new BusinessRuleError('Duplicate products in order');
    }

    const instance = new Order({
      id: props.id,
      customerId: props.customerId,
      customerName: props.customerName,
      customerEmail: email,
      items: ordersItems,
      totalAmount: calculatedTotal,
      currency: firstCurrency,
      status: props.status,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });

    this.validate(instance);
    return instance;
  }

  public confirm(): Order {
    if (this.status !== OrderStatus.PENDING) {
      throw new OrderStatusError('Only pending orders can be confirmed');
    }

    return new Order({ ...this, status: OrderStatus.CONFIRMED, updatedAt: new Date() });
  }

  public ship(): Order {
    if (this.status !== OrderStatus.CONFIRMED) {
      throw new OrderStatusError('Only confirmed orders can be shipped');
    }

    return new Order({ ...this, status: OrderStatus.SHIPPED, updatedAt: new Date() });
  }

  public cancel(): Order {
    if (this.status === OrderStatus.DELIVERED) {
      throw new OrderStatusError('Delivered orders cannot be cancelled');
    }

    if (this.status === OrderStatus.CANCELLED) {
      throw new OrderStatusError('Order is already cancelled');
    }

    return new Order({ ...this, status: OrderStatus.CANCELLED, updatedAt: new Date() });
  }
}
