import { ApiProperty } from '@nestjs/swagger'
import { Kill } from '@prisma/client'

import {
  KillMethodEnum,
  KillTypeEnum,
} from '@app/modules/logs/repositories/enums/kill.enum'

export class Killntity implements Kill {
  @ApiProperty()
  id: number

  @ApiProperty({ enum: KillTypeEnum })
  killType: KillTypeEnum

  @ApiProperty()
  timestamp: Date

  @ApiProperty()
  weapon: string | null

  @ApiProperty()
  method: KillMethodEnum

  @ApiProperty()
  killerId: number

  @ApiProperty()
  matchExternalId: string

  @ApiProperty()
  victimId: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
