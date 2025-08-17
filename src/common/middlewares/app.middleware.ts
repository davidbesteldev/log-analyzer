import { INestApplication, ValidationPipe } from '@nestjs/common'
import { json, urlencoded } from 'express'

import { swaggerConfig } from '@app/config'

import { HttpExceptionFilter } from '@app/common/filters/http-exception.filter'
import { PrismaExceptionFilter } from '@app/common/filters/prisma-exception.filter'

export const appMiddlewares = (app: INestApplication) => {
  app.use(json({ limit: '10mb' }))
  app.use(urlencoded({ limit: '10mb', extended: false }))

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableCors({ origin: '*' })

  app.useGlobalFilters(...[new PrismaExceptionFilter(), new HttpExceptionFilter()])

  swaggerConfig(app)
}
