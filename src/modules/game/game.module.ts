import { Module } from '@nestjs/common'

import { DatabaseModule } from '@app/database/database.module'

import { GameController } from '@app/modules/game/game.controller'
import { GameService } from '@app/modules/game/game.service'
import { GetRankingByMatchUseCase } from '@app/modules/game/use-cases'
import { LogModule } from '@app/modules/logs/log.module'

@Module({
  imports: [DatabaseModule, LogModule],
  controllers: [GameController],
  providers: [GameService, GetRankingByMatchUseCase],
  exports: [],
})
export class GameModule {}
