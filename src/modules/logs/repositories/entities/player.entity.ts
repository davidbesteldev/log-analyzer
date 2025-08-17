import { ApiProperty } from '@nestjs/swagger'
import { Player } from '@prisma/client'

export class PlayerEntity implements Player {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
