import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

import { AppErrorResponse } from '@app/common/errors/app-response.error'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const statusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR
    const message = exception.message
    const path = request.url

    const errorResponse = new AppErrorResponse(statusCode, message, path)

    this.logger.error(
      `[${statusCode}] ${exception.message} on path ${path}`,
      exception.stack,
    )

    response.status(statusCode).json(errorResponse)
  }
}
