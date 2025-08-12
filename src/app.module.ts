import { Module } from '@nestjs/common'

import { EnvModule } from '@app/config'

import { DatabaseModule } from '@app/database/database.module'

@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
