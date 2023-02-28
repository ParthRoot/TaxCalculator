import { Injectable, NestMiddleware } from "@nestjs/common";

import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const log = `http://localhost:3000${req.url}`;
    const body = req.body;

    const data = {
      log,
      body,
    };

    req.headers = data;

    next();
  }
}
