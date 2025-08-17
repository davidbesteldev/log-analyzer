import { Injectable } from '@nestjs/common'

import { GetMatchStatisticsResponseDTO } from '@app/modules/games/dto'
import { MatchRepository, MatchSummaryRepository } from '@app/modules/games/repositories'

@Injectable()
export class GetMatchStatisticsUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchSummaryRepository: MatchSummaryRepository,
  ) {}

  async execute(matchExternalId: string): Promise<GetMatchStatisticsResponseDTO> {
    const match = await this.matchRepository.model.findFirstOrThrow({
      where: { externalId: matchExternalId },
    })

    const summary = await this.matchSummaryRepository.model.findFirstOrThrow({
      where: { matchId: match.id },
    })

    return {
      id: summary.matchId,
      externalId: matchExternalId,
      winnerStats: summary.winnerStats as GetMatchStatisticsResponseDTO['winnerStats'],
      performanceMetrics:
        summary.performanceMetrics as GetMatchStatisticsResponseDTO['performanceMetrics'],
      ranking: summary.ranking as GetMatchStatisticsResponseDTO['ranking'],
    }
  }
}
