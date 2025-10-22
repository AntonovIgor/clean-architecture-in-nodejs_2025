import { injectable } from 'inversify';
import { Response, Router, RequestHandler } from 'express';

import { Route } from '../routes/route.interface.js';

@injectable()
export abstract class BaseController {
  private _router: Router = Router();

  get router(): Router {
    return this._router;
  }

  protected addRoute(route: Route): void {
    const { path, method, handler, middlewares = [] } = route;

    const pipeline: RequestHandler[] = [...middlewares, handler];
    this._router[method](path, pipeline);
  }

  protected sendSuccess<T>(res: Response, data: T, status = 200): void {
    res.status(status).json({ success: true, data });
  }

  protected sendCreated<T>(res: Response, data: T): void {
    this.sendSuccess(res, data, 201);
  }

  protected sendError(res: Response, error: string, status = 400): void {
    res.status(status).json({ success: false, error });
  }
}
