import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    res.on('finish', () => {
      if (res.statusCode < HttpStatus.BAD_REQUEST) {
        const message = `
        \n------------------------------------
        \n[REQUEST]
        \n------------------------------------
        \nRoute: ${req.originalUrl},
        \nMethod: ${req.method},
        \nQuery Params: ${JSON.stringify(req.query)},
        \nBody: ${JSON.stringify(req.body)},
        \n------------------------------------
        \n[RESPONSE]
        \n------------------------------------
        \nStatus: ${res.statusCode}
        \nStatus Message: ${res.statusMessage}
        `;
        Logger.log(message, 'RequestLogger');
      }
    });
    next();
  }
}
