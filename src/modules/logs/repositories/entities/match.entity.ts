import { ApiProperty } from '@nestjs/swagger'
import { Match } from '@prisma/client'

export class MatchEntity implements Match {
  @ApiProperty()
  id: number

  @ApiProperty()
  externalId: string

  @ApiProperty()
  startTime: Date

  @ApiProperty()
  endTime: Date | null

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
