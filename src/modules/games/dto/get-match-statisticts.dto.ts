export class GetMatchStatisticsResponseDTO {
  id: number
  externalId: string
  winnerStats: { name: string; preferredWeapon: string; noDeathAward: boolean } | null
  performanceMetrics: {
    longestKillStreak: { name: string; count: number }
    speedKillerAwards: string[]
  } | null
  ranking: { name: string; frags: number; deaths: number }[] | null
}
