import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from '@app/app.module'
import { EnvService } from '@app/config'

import { appMiddlewares } from '@app/common/middlewares/app.middleware'

function handleBigIntSerialization() {
  BigInt.prototype['toJSON'] = function (this: bigint) {
    return this.toString()
  }
}

async function bootstrap() {
  handleBigIntSerialization()

  const app = await NestFactory.create(AppModule)

  const envService = app.get(EnvService)
  const appConfig = envService.get('app')

  appMiddlewares(app)

  Logger.log(`Server is running on port ${appConfig.port} in ${appConfig.nodeEnv} mode`)
  await app.listen(appConfig.port)
}
void bootstrap()
