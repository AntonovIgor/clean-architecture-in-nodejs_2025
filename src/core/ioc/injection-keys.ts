export const InjectionKeys = {
  // Core
  Logger: Symbol.for('Logger'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),

  // Customers module
  CustomersController: Symbol.for('CustomersController'),
  CreateCustomerUseCase: Symbol.for('CreateCustomerUseCase'),
  GetAllCustomersUseCase: Symbol.for('GetAllCustomersUseCase'),
  GetCustomerByIdUseCase: Symbol.for('GetCustomerByIdUseCase'),
  GetCustomerOrdersUseCase: Symbol.for('GetCustomerOrdersUseCase'), // Если есть
  CustomerRepository: Symbol.for('CustomerRepository'),

  // Products module
  ProductsController: Symbol.for('ProductsController'),
  CreateProductUseCase: Symbol.for('CreateProductUseCase'),
  GetAllProductsUseCase: Symbol.for('GetAllProductsUseCase'),
  GetProductByIdUseCase: Symbol.for('GetProductByIdUseCase'),
  ProductRepository: Symbol.for('ProductRepository'),

  // Orders module
  OrdersController: Symbol.for('OrdersController'),
  CreateOrderUseCase: Symbol.for('CreateOrderUseCase'),
  GetAllOrdersUseCase: Symbol.for('GetAllOrdersUseCase'),
  GetOrderByIdUseCase: Symbol.for('GetOrderByIdUseCase'),
  ConfirmOrderUseCase: Symbol.for('ConfirmOrderUseCase'),
  ShipOrderUseCase: Symbol.for('ShipOrderUseCase'),
  CancelOrderUseCase: Symbol.for('CancelOrderUseCase'),
  OrderRepository: Symbol.for('OrderRepository'),
} as const;

export type InjectionKey = typeof InjectionKeys[keyof typeof InjectionKeys];
