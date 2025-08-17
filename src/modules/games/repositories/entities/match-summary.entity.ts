import { ApiProperty } from '@nestjs/swagger'
import { MatchSummary } from '@prisma/client'

export class MatchSummaryEntity implements MatchSummary {
  @ApiProperty()
  matchId: number

  @ApiProperty()
  winnerStats: {
    name: string
    preferredWeapon: string
    noDeathAward: boolean
  } | null

  @ApiProperty()
  performanceMetrics: {
    longestKillStreak: {
      name: string
      count: number
    } | null
    speedKillerAwards: string[]
  }

  @ApiProperty()
  ranking: {
    name: string
    frags: number
    deaths: number
  }[]

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
