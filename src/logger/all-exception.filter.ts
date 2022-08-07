import {
  Catch,
  ArgumentsHost,
  HttpAdapterHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  Injectable,
} from '@nestjs/common';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter<Error> {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    Logger.error(exception.message, exception.stack);

    const error =
      exception instanceof HttpException
        ? {
            statusCode: exception.getStatus(),
            message: exception.message,
          }
        : {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error',
          };

    const responseBody = {
      ...error,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, error.statusCode);
  }
}
