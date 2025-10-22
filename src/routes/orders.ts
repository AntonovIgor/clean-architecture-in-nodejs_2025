import express, { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import {
  Order,
  OrderItem,
  OrderStatus,
  CreateOrderRequest,
  ApiError,
  Product
} from '../models/types.js';

import {
  orders,
  findCustomerById,
  findProductById,
  findOrderById
} from '../models/database.js';

const ordersRouter = express.Router();

/* Создать заказ */
ordersRouter.post('/', (req: Request<{}, Order | ApiError, CreateOrderRequest>, res: Response<Order | ApiError>): void => {
  try {
    const { customerId, items }: CreateOrderRequest = req.body;

    if (!customerId || typeof customerId !== 'string') {
      res.status(400).json({ error: 'Customer ID is required' });
      return;
    }

    const customer = findCustomerById(customerId);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    // Валидация items
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Order must have at least one item' });
      return;
    }

    if (items.length > 50) {
      res.status(400).json({ error: 'Order cannot have more than 50 items' });
      return;
    }

    const orderItems: OrderItem[] = [];
    let totalAmount: number = 0;
    let currency: string = '';

    // Обработка каждого элемента заказа
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const { productId, quantity } = item;

      // Валидация productId
      if (!productId || typeof productId !== 'string') {
        res.status(400).json({ error: `Product ID is required for item ${i + 1}` });
        return;
      }

      // Валидация количества
      if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
        res.status(400).json({ error: `Quantity must be positive for item ${i + 1}` });
        return;
      }

      if (quantity > 1000) {
        res.status(400).json({ error: `Quantity cannot exceed 1000 for item ${i + 1}` });
        return;
      }

      // Поиск продукта
      const product = findProductById(productId);
      if (!product) {
        res.status(404).json({ error: `Product ${productId} not found` });
        return;
      }

      // Проверка остатка
      if (product.stock < quantity) {
        res.status(400).json({
          error: `Insufficient stock for product ${product.name}. Available: ${product.stock}, requested: ${quantity}`
        });
        return;
      }

      // Проверка валюты (должна быть одинаковой для всех товаров)
      if (currency === '') {
        currency = product.currency;
      } else if (currency !== product.currency) {
        res.status(400).json({ error: 'All products must have the same currency' });
        return;
      }

      // Проверка на дублирование товаров в заказе
      const existingItem: OrderItem | undefined = orderItems.find(oi => oi.productId === productId);
      if (existingItem) {
        res.status(400).json({ error: `Product ${product.name} is already in the order` });
        return;
      }

      // Уменьшение остатка товара (мутация глобального состояния)
      product.stock -= quantity;
      product.updatedAt = new Date();

      const itemTotal: number = product.price * quantity;
      totalAmount += itemTotal;

      const orderItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
        total: itemTotal
      };

      orderItems.push(orderItem);
    }

    // Дополнительная валидация общей суммы
    if (totalAmount > 5000000) {
      res.status(400).json({ error: 'Order total amount is too high' });
      return;
    }

    // Создание заказа
    const order: Order = {
      id: randomUUID(),
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      items: orderItems,
      totalAmount,
      currency,
      status: OrderStatus.PENDING,
      createdAt: new Date()
    };

    orders.push(order);

    res.status(201).json(order);
  } catch (error: unknown) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* Подтвердить заказ */
ordersRouter.patch('/:id/confirm', (req: Request<{ id: string }>, res: Response<Order | ApiError>): void => {
  try {
    const { id }: { id: string } = req.params;

    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Order ID is required' });
      return;
    }

    // Поиск заказа
    const order: Order | undefined = findOrderById(id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Проверка статуса (бизнес-логика в контроллере)
    if (order.status !== OrderStatus.PENDING) {
      res.status(400).json({ error: 'Only pending orders can be confirmed' });
      return;
    }

    // Дополнительная проверка доступности товаров
    for (const item of order.items) {
      const product: Product | undefined = findProductById(item.productId);
      if (!product) {
        res.status(400).json({ error: `Product ${item.productName} no longer exists` });
        return;
      }
    }

    order.status = OrderStatus.CONFIRMED;
    order.updatedAt = new Date();

    res.json(order);
  } catch (error: unknown) {
    console.error('Error confirming order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* Отправить заказ */
ordersRouter.patch('/:id/ship', (req: Request<{ id: string }>, res: Response<Order | ApiError>): void => {
  try {
    const { id }: { id: string } = req.params;

    const order: Order | undefined = findOrderById(id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.status !== OrderStatus.CONFIRMED) {
      res.status(400).json({ error: 'Only confirmed orders can be shipped' });
      return;
    }

    order.status = OrderStatus.SHIPPED;
    order.updatedAt = new Date();

    res.json(order);
  } catch (error: unknown) {
    console.error('Error shipping order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* Отменить заказ */
ordersRouter.patch('/:id/cancel', (req: Request<{ id: string }>, res: Response<Order | ApiError>): void => {
  try {
    const { id }: { id: string } = req.params;

    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Order ID is required' });
      return;
    }

    // Опять тот же поиск заказа
    const order: Order | undefined = findOrderById(id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Бизнес-правило прямо в контроллере
    if (order.status === OrderStatus.DELIVERED) {
      res.status(400).json({ error: 'Delivered orders cannot be cancelled' });
      return;
    }

    if (order.status === OrderStatus.CANCELLED) {
      res.status(400).json({ error: 'Order is already cancelled' });
      return;
    }

    // Возвращение товаров на склад (логика разбросана)
    for (const item of order.items) {
      const product = findProductById(item.productId);
      if (product) {
        product.stock += item.quantity;
        product.updatedAt = new Date();
      }
    }

    order.status = OrderStatus.CANCELLED;
    order.updatedAt = new Date();

    res.json(order);
  } catch (error: unknown) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* Получить все заказы */
ordersRouter.get('/', (_req: Request, res: Response<Order[]>) => {
  res.json(orders);
});

/* Получить заказ по ID */
ordersRouter.get('/:id', (req: Request<{ id: string }>, res: Response<Order | ApiError>): void => {
  try {
    const { id }: { id: string } = req.params;

    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Order ID is required' });
      return;
    }

    const order: Order | undefined = findOrderById(id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error: unknown) {
    console.error('Error getting order:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

export { ordersRouter };
