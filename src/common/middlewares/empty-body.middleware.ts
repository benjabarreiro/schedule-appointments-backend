import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class EmptyBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (
      ['POST', 'PUT'].includes(req.method) &&
      Object.keys(req.body).length === 0
    ) {
      throw new BadRequestException('Request body cannot be empty');
    }
    next();
  }
}
