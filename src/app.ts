import express, { Application, Request, Response, NextFunction } from 'express';

import { customersRouter, productsRouter, ordersRouter } from './routes/index.js';
import { initDatabase } from './models/database.js';

const app: Application = express();

// Инициализация middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Простой middleware для логирования
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Инициализация БД
initDatabase();

// Маршруты
app.use('/api/customers', customersRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Глобальный обработчик ошибок 404
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Глобальный фильтр исключений
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('🚏 POST /api/customers - Create customer');
  console.log('🚏 GET  /api/customers - Get all customers');
  console.log('🚏 GET  /api/customers/:id - Get customer by ID');
  console.log('🚏 POST /api/products - Create product');
  console.log('🚏 GET  /api/products - Get all products');
  console.log('🚏 GET  /api/products/:id - Get product by ID');
  console.log('🚏 POST /api/orders - Create order');
  console.log('🚏 GET  /api/orders - Get all orders');
  console.log('🚏 GET  /api/orders/:id - Get order by ID');
  console.log('🚏 PATCH /api/orders/:id/confirm - Confirm order');
  console.log('🚏 PATCH /api/orders/:id/ship - Ship order');
  console.log('🚏 PATCH /api/orders/:id/cancel - Cancel order');
  console.log('🚏 GET  /api/customers/:id/orders - Get customer orders');
  console.log('🚏 GET  /health - Health check');
});

export default app;
