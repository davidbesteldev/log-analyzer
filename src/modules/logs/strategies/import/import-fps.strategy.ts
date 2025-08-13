import { Injectable } from '@nestjs/common'

import { REGEX_DATE_TIME } from '@app/common/constants'

import { ImportTypeEnum } from '@app/modules/logs/enums'
import { ExtractFromLogHelper } from '@app/modules/logs/helpers'
import { IImportStrategy } from '@app/modules/logs/interfaces'

@Injectable()
export class ImportFPSStrategy implements IImportStrategy {
  constructor(private readonly extractFromLogHelper: ExtractFromLogHelper) {}

  getType(): ImportTypeEnum {
    return ImportTypeEnum.FPS
  }

  async handle(file: Express.Multer.File): Promise<void> {
    const patterns = [
      { name: 'match-start', regex: /New match (?<id>\d+) has started/ },
      { name: 'kill', regex: /(?<killer>\w+) killed (?<victim>\w+)/ },
      { name: 'match-end', regex: /Match (?<id>\d+) has ended/ },
    ]

    this.extractFromLogHelper.execute(
      file.buffer.toString('utf-8'),
      REGEX_DATE_TIME,
      patterns,
    )
  }
}
