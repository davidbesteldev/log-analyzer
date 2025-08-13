import { Injectable } from '@nestjs/common'

import { ImportDTO } from '@app/modules/logs/dto'
import { ImportUseCase } from '@app/modules/logs/use-cases'

@Injectable()
export class LogService {
  constructor(private readonly importUseCase: ImportUseCase) {}

  uploadFile(file: Express.Multer.File, body: ImportDTO) {
    return this.importUseCase.execute(file, body)
  }
}
