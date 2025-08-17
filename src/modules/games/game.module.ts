import { Module } from '@nestjs/common'

import { DatabaseModule } from '@app/database/database.module'

import { GameController } from '@app/modules/games/game.controller'
import { GameService } from '@app/modules/games/game.service'
import {
  KillRepository,
  MatchRepository,
  PlayerRepository,
} from '@app/modules/games/repositories'
import { GetRankingByMatchUseCase } from '@app/modules/games/use-cases'

const repositores = [MatchRepository, PlayerRepository, KillRepository]

@Module({
  imports: [DatabaseModule],
  controllers: [GameController],
  providers: [...repositores, GameService, GetRankingByMatchUseCase],
  exports: [...repositores],
})
export class GameModule {}
