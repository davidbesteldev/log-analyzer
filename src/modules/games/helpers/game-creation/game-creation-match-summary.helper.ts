import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { DateUtil } from '@app/common/utils/date.util'

import { WORLD_KILLER } from '@app/modules/games/constants'
import { CreateMatchDTO } from '@app/modules/games/dto'
import {
  KillRepository,
  MatchSummaryRepository,
  PlayerRepository,
} from '@app/modules/games/repositories'
import { MatchSummaryEntity } from '@app/modules/games/repositories/entities/match-summary.entity'
import { IPlayerRankingPerformance } from '@app/modules/games/repositories/interfaces/player.interface'

@Injectable()
export class GameCreationMatchSummaryHelper {
  constructor(
    private readonly matchSummaryRepository: MatchSummaryRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly killRepository: KillRepository,
  ) {}

  async execute(
    match: CreateMatchDTO,
    internalMatchId: number,
    playerMap: Map<string, number>,
    tx?: Prisma.TransactionClient,
  ) {
    const matchSummaryModel = tx?.matchSummary || this.matchSummaryRepository.model

    const rankedPlayers = await this.playerRepository.getRankingPerformance(
      match.externalId,
    )
    const winnerStats = await this.getWinnerStats(match.externalId, rankedPlayers)
    const { longestKillStreak, speedKillerAwards } = this.getMatchPerformanceMetrics(
      match,
      playerMap,
    )

    const payload: Omit<MatchSummaryEntity, 'matchId' | 'createdAt' | 'updatedAt'> = {
      ranking: rankedPlayers,
      winnerStats,
      performanceMetrics: { longestKillStreak, speedKillerAwards },
    }

    return matchSummaryModel.upsert({
      where: { matchId: internalMatchId },
      update: payload as Prisma.MatchSummaryUpdateInput,
      create: {
        ...payload,
        match: { connect: { id: internalMatchId } },
      } as Prisma.MatchSummaryCreateInput,
    })
  }

  private async getWinnerStats(
    matchExternalId: string,
    rankedPlayers: IPlayerRankingPerformance[],
  ): Promise<MatchSummaryEntity['winnerStats']> {
    const [winner] = rankedPlayers
    if (!winner?.playerId) return null

    const [winnerPreferredWeapon] = await this.killRepository.model.groupBy({
      by: ['weapon'],
      where: { killerId: winner.playerId, matchExternalId },
      _count: { weapon: true },
      orderBy: { _count: { weapon: 'desc' } },
      take: 1,
    })
    if (!winnerPreferredWeapon?.weapon) return null

    return {
      name: winner.name,
      preferredWeapon: winnerPreferredWeapon.weapon,
      noDeathAward: !winner.deaths,
    }
  }

  private getMatchPerformanceMetrics(
    match: CreateMatchDTO,
    playerMap: Map<string, number>,
  ): MatchSummaryEntity['performanceMetrics'] {
    let longestKillStreak: MatchSummaryEntity['performanceMetrics']['longestKillStreak'] =
      null
    let currentStreak: { playerId: number; count: number } | null = null

    const allPlayers = new Set<string>()
    const victims = new Set<string>()
    const killsByPlayer = new Map<string, string[]>()

    const allKillsSorted = match.kills.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )

    for (const kill of allKillsSorted) {
      const killerId = playerMap.get(kill.killer)

      allPlayers.add(kill.killer)
      allPlayers.add(kill.victim)
      victims.add(kill.victim)

      if (kill.killer === WORLD_KILLER || !killerId) {
        currentStreak = null
      } else {
        if (currentStreak && currentStreak.playerId === killerId) {
          currentStreak.count++
        } else {
          currentStreak = { playerId: killerId, count: 1 }
        }

        if (currentStreak.count > (longestKillStreak?.count || 0)) {
          longestKillStreak = {
            name: kill.killer,
            count: currentStreak.count,
          }
        }

        if (!killsByPlayer.has(kill.killer)) killsByPlayer.set(kill.killer, [])
        killsByPlayer.get(kill.killer)!.push(kill.timestamp)
      }
    }

    allPlayers.delete(WORLD_KILLER)

    const { speedKillerAwards } = this.calculateAwards(killsByPlayer)

    return {
      longestKillStreak,
      speedKillerAwards,
    }
  }

  private calculateAwards(killsByPlayer: Map<string, string[]>): {
    speedKillerAwards: string[]
  } {
    const speedKillerAwardsSet = new Set<string>()
    const dateFormat = 'DD/MM/YYYY HH:mm:ss'

    for (const [player, timestamps] of killsByPlayer.entries()) {
      if (timestamps.length >= 5) {
        const sortedTimestamps = timestamps.sort(
          (a, b) =>
            DateUtil.getTimestampFromString(a, dateFormat) -
            DateUtil.getTimestampFromString(b, dateFormat),
        )

        for (let i = 4; i < sortedTimestamps.length; i++) {
          const timeDiffInMinutes = DateUtil.diffInMinutes(
            sortedTimestamps[i - 4],
            sortedTimestamps[i],
            dateFormat,
          )

          if (timeDiffInMinutes <= 1) {
            speedKillerAwardsSet.add(player)
            break
          }
        }
      }
    }

    return { speedKillerAwards: [...speedKillerAwardsSet] }
  }
}
