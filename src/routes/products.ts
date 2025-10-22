import express, { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import {
  Product,
  CreateProductRequest,
  ApiError
} from '../models/types.js';

import {
  products,
  findProductById
} from '../models/database.js';

const productsRouter = express.Router();

/* Создать новый продукт */
productsRouter.post('/', (req: Request<{}, Product | ApiError, CreateProductRequest>, res: Response<Product | ApiError>): void => {
  try {
    const { name, price, currency, stock }: CreateProductRequest = req.body;

    // Валидация названия (дублируется логика из customers)
    if (!name || name.trim().length === 0) {
      res.status(400).json({ error: 'Name cannot be empty' });
      return;
    }

    if (name.length > 200) {
      res.status(400).json({ error: 'Product name cannot exceed 200 characters' });
      return;
    }

    // Валидация цены
    if (price === undefined || price === null || price < 0) {
      res.status(400).json({ error: 'Price must be positive' });
      return;
    }

    if (price > 10000000) {
      res.status(400).json({ error: 'Price is too high' });
      return;
    }

    // Валидация валюты
    if (!currency || currency.length !== 3) {
      res.status(400).json({ error: 'Currency must be 3-letter code' });
      return;
    }

    const allowedCurrencies: string[] = ['RUB', 'USD', 'EUR'];
    if (!allowedCurrencies.includes(currency.toUpperCase())) {
      res.status(400).json({ error: 'Unsupported currency' });
      return;
    }

    // Валидация остатка
    if (stock < 0) {
      res.status(400).json({ error: 'Stock cannot be negative' });
      return;
    }

    if (stock > 100000) {
      res.status(400).json({ error: 'Stock is too high' });
      return;
    }

    const product: Product = {
      id: randomUUID(),
      name: name.trim(),
      price,
      currency: currency.toUpperCase(),
      stock,
      createdAt: new Date()
    };

    products.push(product);
    res.status(201).json(product);
  } catch (error: unknown) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* Получить все продукты */
productsRouter.get('/', (_req: Request, res: Response<Product[]>): void => {
  res.json(products);
});

/* Получить товар по ID */
productsRouter.get('/:id', (req: Request<{ id: string }>, res: Response<Product | ApiError>): void => {
  try {
    const { id }: { id: string } = req.params;

    const product: Product | undefined = findProductById(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error: unknown) {
    console.error('Error getting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { productsRouter };
