import { getRankingPerformance } from '@prisma/client/sql'

export interface IPlayerRankingPerformance
  extends Omit<getRankingPerformance.Result, 'frags' | 'deaths'> {
  frags: number
  deaths: number
}
