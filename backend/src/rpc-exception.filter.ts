import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { BaseError } from './errors';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<BaseError> {
  catch(exception: BaseError, _host: ArgumentsHost): Observable<any> {
    /*
    return throwError(() => ({
      status: 'error',
      error: exception.name,
      message: exception.info,
    }));
    */

    return throwError(() => exception);
  }
}
