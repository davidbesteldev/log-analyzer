import { Module } from '@nestjs/common'

import { DatabaseModule } from '@app/database/database.module'

import { LOG_IMPORT_FACTORY } from '@app/modules/game/constants'
import { ImportFactory } from '@app/modules/logs/factories/import.factory'
import * as helpers from '@app/modules/logs/helpers'
import { IImportStrategy } from '@app/modules/logs/interfaces'
import { LogController } from '@app/modules/logs/log.controller'
import { LogService } from '@app/modules/logs/log.service'
import {
  KillRepository,
  MatchRepository,
  PlayerRepository,
} from '@app/modules/logs/repositories'
import * as importStrategies from '@app/modules/logs/strategies/import'
import * as useCases from '@app/modules/logs/use-cases'

const repositores = [MatchRepository, PlayerRepository, KillRepository]

@Module({
  imports: [DatabaseModule],
  controllers: [LogController],
  providers: [
    ...repositores,
    ImportFactory,
    ...Object.values(helpers),
    ...Object.values(useCases),
    ...Object.values(importStrategies),
    LogService,
    {
      provide: LOG_IMPORT_FACTORY,
      useFactory: (...strategies: IImportStrategy[]) => [...strategies],
      inject: [...Object.values(importStrategies)],
    },
  ],
  exports: [LOG_IMPORT_FACTORY, ...repositores],
})
export class LogModule {}
