import { Customer, Product, Order } from './types.js';

export const customers: Customer[] = [];
export const products: Product[] = [];
export const orders: Order[] = [];

export function initDatabase(): void {
  const customer: Customer = {
    id: '342d9844-4c68-49f3-bf31-12cc9a468cef',
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    createdAt: new Date()
  };
  customers.push(customer);

  const product1: Product = {
    id: '0ec82181-d986-4ede-8622-b26ff7c3528a',
    name: 'Ноутбук',
    price: 50000,
    currency: 'RUB',
    stock: 10,
    createdAt: new Date()
  };

  const product2: Product = {
    id: '91e17667-548d-4543-a7f8-438e9a85ae8b',
    name: 'Мышь',
    price: 1500,
    currency: 'RUB',
    stock: 50,
    createdAt: new Date()
  };

  products.push(product1, product2);

  console.log('Test data initialized:');
  console.log(`Customer ID: ${customer.id}`);
  console.log(`Product 1 ID: ${product1.id}`);
  console.log(`Product 2 ID: ${product2.id}`);
}

export function findCustomerById(id: string): Customer | undefined {
  return customers.find(c => c.id === id);
}

export function findCustomerByEmail(email: string): Customer | undefined {
  return customers.find(c => c.email === email);
}

export function findProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function findOrderById(id: string): Order | undefined {
  return orders.find(o => o.id === id);
}

export function findOrdersByCustomerId(customerId: string): Order[] {
  return orders.filter(o => o.customerId === customerId);
}
