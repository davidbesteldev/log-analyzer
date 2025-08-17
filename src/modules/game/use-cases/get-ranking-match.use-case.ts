import { Injectable } from '@nestjs/common'

import { MatchRepository, PlayerRepository } from '@app/modules/logs/repositories'

@Injectable()
export class GetRankingByMatchUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly playerRepository: PlayerRepository,
  ) {}

  async execute(externalMatchId: string) {
    await this.matchRepository.model.findFirstOrThrow({
      where: { externalId: externalMatchId },
    })

    return this.playerRepository.getRankingPerformance(externalMatchId)
  }
}
