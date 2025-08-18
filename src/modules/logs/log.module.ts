import { Module } from '@nestjs/common'

import { LOG_IMPORT_FACTORY } from '@app/common/constants'

import { DatabaseModule } from '@app/database/database.module'

import { GameModule } from '@app/modules/games/game.module'
import { ImportFactory } from '@app/modules/logs/factories/import.factory'
import * as helpers from '@app/modules/logs/helpers'
import { IImportStrategy } from '@app/modules/logs/interfaces'
import { LogController } from '@app/modules/logs/log.controller'
import { LogService } from '@app/modules/logs/log.service'
import * as importStrategies from '@app/modules/logs/strategies/import'
import * as useCases from '@app/modules/logs/use-cases'

@Module({
  imports: [DatabaseModule, GameModule],
  controllers: [LogController],
  providers: [
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
  exports: [LOG_IMPORT_FACTORY],
})
export class LogModule {}
