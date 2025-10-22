import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';

import { container } from './core/ioc/container.js';
import { InjectionKeys } from './core/ioc/injection-keys.js';
import { Logger } from './core/logger/logger.interface.js';
import { ExceptionFilter } from './core/exception/exception-filter.js';
import initDatabase from './infrastructure/init-database.js';

// Биндинги для модулей
import customersBindings from './modules/customers/bindings.js';
import productsBindings from './modules/products/bindings.js';
import ordersBindings from './modules/orders/bindings.js';

// Контроллеры
import { CustomersController } from './modules/customers/presentation/customers.controller.js';
import { ProductsController } from './modules/products/presentation/products.controller.js';
import { OrdersController } from './modules/orders/presentation/orders.controller.js';

// Регистрация bindings в container
customersBindings(container);
productsBindings(container);
ordersBindings(container);

const app: Application = express();
const logger = container.get<Logger>(InjectionKeys.Logger);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Глобальный middleware для логирования
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Инициализация базы данных
await initDatabase();

// Извлекаем из контейнера контроллеры
const customersController = container.get<CustomersController>(InjectionKeys.CustomersController);
const productsController = container.get<ProductsController>(InjectionKeys.ProductsController);
const ordersController = container.get<OrdersController>(InjectionKeys.OrdersController);

// Регистрируем маршруты
app.use('/api/customers', customersController.router);
app.use('/api/products', productsController.router);
app.use('/api/orders', ordersController.router);

// health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Глобальный фильтр исключений
const exceptionFilter = container.get<ExceptionFilter>(InjectionKeys.ExceptionFilter);
app.use(exceptionFilter.handler.bind(exceptionFilter));

const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info('📋 Available endpoints:');
  logger.info('🎯 POST /api/customers - Create customer');
  logger.info('🎯 GET  /api/customers - Get all customers');
  logger.info('🎯 GET  /api/customers/:id - Get customer by ID');
  logger.info('🎯 GET  /api/customers/:id/orders - Get customer orders');
  logger.info('🎯 POST /api/products - Create product');
  logger.info('🎯 GET  /api/products - Get all products');
  logger.info('🎯 GET  /api/products/:id - Get product by ID');
  logger.info('🎯 POST /api/orders - Create order');
  logger.info('🎯 GET  /api/orders - Get all orders');
  logger.info('🎯 GET  /api/orders/:id - Get order by ID');
  logger.info('🎯 PATCH /api/orders/:id/confirm - Confirm order');
  logger.info('🎯 PATCH /api/orders/:id/ship - Ship order');
  logger.info('🎯 PATCH /api/orders/:id/cancel - Cancel order');
  logger.info('🎯 GET  /health - Health check');
});

export default app;
