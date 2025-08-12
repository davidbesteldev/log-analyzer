import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EnvService } from '@app/config/env/env.service'
import { envValidation } from '@app/config/env/env.validation'

@Module({
  imports: [ConfigModule.forRoot({ validate: envValidation })],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
