import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { ImportTypeEnum } from '@app/modules/logs/enums'

export class ImportDTO {
  @ApiProperty({ type: 'string', format: 'binary' }) // declare here for swagger doc
  file: Express.Multer.File

  @ApiProperty({ enum: ImportTypeEnum })
  @IsEnum(ImportTypeEnum)
  logType: ImportTypeEnum
}
