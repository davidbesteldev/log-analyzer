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

    return this.matchSummaryRepository.model.findFirstOrThrow({
      where: { matchId: match.id },
    })
  }
}
