import { Catch, ArgumentsHost, ExceptionFilter, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, _: ArgumentsHost) {
    switch (exception.code) {
      case 'P2025':
        throw new NotFoundException('O registro solicitado não foi encontrado.')

      default:
        throw exception
    }
  }
}
