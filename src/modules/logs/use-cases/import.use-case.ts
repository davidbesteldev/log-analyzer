import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common'

import { LOG_IMPORT_FACTORY } from '@app/modules/logs/constants'
import { ImportDTO } from '@app/modules/logs/dto'
import { IImportStrategy } from '@app/modules/logs/interfaces'

@Injectable()
export class ImportUseCase {
  constructor(
    @Inject(LOG_IMPORT_FACTORY)
    private readonly importStrategies: IImportStrategy[],
  ) {}

  async execute(file: Express.Multer.File, body: ImportDTO) {
    const strategy = this.importStrategies.find((h) => h.getType() === body.logType)

    if (!strategy) {
      throw new UnprocessableEntityException(
        `Nenhuma estratégia encontrada para o tipo: ${body.logType}`,
      )
    }

    return strategy.handle(file)
  }
}
