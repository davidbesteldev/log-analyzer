import { Module } from '@nestjs/common'

import { DatabaseModule } from '@app/database/database.module'

import { GameController } from '@app/modules/games/game.controller'
import { GameService } from '@app/modules/games/game.service'
import * as GameCreationHelpers from '@app/modules/games/helpers/game-creation'
import {
  KillRepository,
  MatchRepository,
  MatchSummaryRepository,
  PlayerRepository,
} from '@app/modules/games/repositories'
import {
  GetMatchesUseCase,
  GetMatchStatisticsUseCase,
} from '@app/modules/games/use-cases'

const repositores = [
  MatchRepository,
  MatchSummaryRepository,
  PlayerRepository,
  KillRepository,
]

@Module({
  imports: [DatabaseModule],
  controllers: [GameController],
  providers: [
    ...repositores,
    ...Object.values(GameCreationHelpers),
    GameService,
    GetMatchesUseCase,
    GetMatchStatisticsUseCase,
  ],
  exports: [...repositores, ...Object.values(GameCreationHelpers)],
})
export class GameModule {}
