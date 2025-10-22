import express, { Request, Response } from 'express';

import { randomUUID } from 'node:crypto';

import {
  Customer,
  Order,
  CreateCustomerRequest,
  ApiError
} from '../models/types.js';

import {
  customers,
  findCustomerById,
  findCustomerByEmail,
  findOrdersByCustomerId
} from '../models/database.js';

const customersRouter = express.Router();

/* Создание клиента */
customersRouter.post('/', (req: Request<{}, Customer | ApiError, CreateCustomerRequest>, res: Response<Customer | ApiError>): void => {
  try {
    const { name, email }: CreateCustomerRequest = req.body;

    // Валидация email
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // У покупателя должен быть уникальный email
    const existingCustomer: Customer | undefined = findCustomerByEmail(email);
    if (existingCustomer) {
      res.status(400).json({ error: 'Customer with this email already exists' });
      return;
    }

    // Валидация имени
    if (!name || name.trim().length === 0) {
      res.status(400).json({ error: 'Name cannot be empty' });
      return;
    }

    if (name.length > 100) {
      res.status(400).json({ error: 'Name cannot exceed 100 characters' });
      return;
    }

    const customer: Customer = {
      id: randomUUID(),
      name: name.trim(),
      email,
      createdAt: new Date()
    };

    customers.push(customer);
    res.status(201).json(customer);
  } catch (error: unknown) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* Список всех клиентов */
customersRouter.get('/', (_req: Request, res: Response<Customer[]>): void => {
  res.json(customers);
});

/* Получить клиента по ID */
customersRouter.get('/:id', (req: Request<{ id: string }>, res: Response<Customer | ApiError>): void => {
  try {
    const { id }: { id: string } = req.params;

    const customer: Customer | undefined = findCustomerById(id);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.json(customer);
  } catch (error: unknown) {
    console.error('Error getting customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* Получить заказы клиента */
customersRouter.get('/:id/orders', (req: Request<{ id: string }>, res: Response<Order[] | ApiError>): void => {
  try {
    const { id }: { id: string } = req.params;

    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Customer ID is required' });
      return;
    }


    const customer: Customer | undefined = findCustomerById(id);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const customerOrders: Order[] = findOrdersByCustomerId(id);
    res.json(customerOrders);
  } catch (error: unknown) {
    console.error('Error getting customer orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { customersRouter };
