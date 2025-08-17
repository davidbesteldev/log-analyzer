import { Injectable } from '@nestjs/common'

import { MatchRepository, PlayerRepository } from '@app/modules/logs/repositories'

@Injectable()
export class GetRankingByMatchUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly playerRepository: PlayerRepository,
  ) {}

  async execute(matchExternalId: string) {
    await this.matchRepository.model.findFirstOrThrow({
      where: { externalId: matchExternalId },
    })

    return this.playerRepository.getRankingPerformance(matchExternalId)
  }
}
