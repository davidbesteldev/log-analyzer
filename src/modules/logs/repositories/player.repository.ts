import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { getRankingPerformance } from '@prisma/client/sql'

import { BaseRepository } from '@app/common/database/repositories/base.repository'

import { DatabaseService } from '@app/database/database.service'

import { IPlayerRankingPerformance } from '@app/modules/logs/repositories/interfaces/player.interface'

@Injectable()
export class PlayerRepository extends BaseRepository<Prisma.PlayerDelegate> {
  constructor(private readonly prismaService: DatabaseService) {
    super(prismaService.player)
  }

  async getRankingPerformance(
    externalMatchId: string,
  ): Promise<IPlayerRankingPerformance[]> {
    const result = await this.prismaService.$queryRawTyped(
      getRankingPerformance(externalMatchId),
    )
    return result.map((r) => ({ ...r, deaths: Number(r.deaths), frags: Number(r.frags) }))
  }
}
