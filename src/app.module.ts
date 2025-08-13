import { Module } from '@nestjs/common'

import { EnvModule } from '@app/config'

import { DatabaseModule } from '@app/database/database.module'

import { LogModule } from '@app/modules/logs/log.module'

@Module({
  imports: [EnvModule, DatabaseModule, LogModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
