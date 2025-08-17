import { Injectable } from '@nestjs/common'

import { ImportDTO } from '@app/modules/logs/dto'
import { ImportFactory } from '@app/modules/logs/factories/import.factory'

@Injectable()
export class ImportUseCase {
  constructor(private readonly importFactory: ImportFactory) {}

  async execute(file: Express.Multer.File, body: ImportDTO) {
    await this.importFactory.get(body.logType).handle(file)
  }
}
