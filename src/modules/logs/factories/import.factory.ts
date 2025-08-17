import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common'

import { LOG_IMPORT_FACTORY } from '@app/modules/games/constants'
import { ImportTypeEnum } from '@app/modules/logs/enums'
import { IImportStrategy } from '@app/modules/logs/interfaces'

@Injectable()
export class ImportFactory {
  constructor(
    @Inject(LOG_IMPORT_FACTORY)
    private readonly importStrategies: IImportStrategy[],
  ) {}

  get(logType: ImportTypeEnum) {
    const strategy = this.importStrategies.find((h) => h.getType() === logType)

    if (!strategy) {
      throw new UnprocessableEntityException(
        `Nenhuma estratégia encontrada para o tipo: ${logType}`,
      )
    }

    return strategy
  }
}
