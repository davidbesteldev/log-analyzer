import { IsEnum } from 'class-validator'

import { ImportTypeEnum } from '@app/modules/logs/enums'

export class ImportDTO {
  @IsEnum(ImportTypeEnum)
  logType: ImportTypeEnum
}
