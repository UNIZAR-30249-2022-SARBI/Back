/*import { Catch } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import { ValidationFailed } from 'sequelize-typescript';

@Catch(RpcException)
export class ExceptionFilter {
    catch(exception, host) {
        return throwError(exception.getError());
    }
}*/