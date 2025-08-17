import { Module } from '@nestjs/common'

import { EnvModule } from '@app/config'

import { DatabaseModule } from '@app/database/database.module'

import { GameModule } from '@app/modules/games/game.module'
import { LogModule } from '@app/modules/logs/log.module'

@Module({
  imports: [EnvModule, DatabaseModule, LogModule, GameModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
