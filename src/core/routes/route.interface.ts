import { RequestHandler } from 'express';

export interface Route {
  path: string;
  method: 'get' | 'post' | 'patch' | 'delete';
  handler: RequestHandler;
  middlewares?: RequestHandler[];
}
