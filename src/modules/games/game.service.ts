import { Injectable } from '@nestjs/common'

import { GetMatchesQueryDto } from '@app/modules/games/dto'
import { GetMatchStatisticsUseCase } from '@app/modules/games/use-cases'
import { GetMatchesUseCase } from '@app/modules/games/use-cases/get-matches.use-case'

@Injectable()
export class GameService {
  constructor(
    private readonly getMatchesUseCase: GetMatchesUseCase,
    private readonly getMatchStatisticsUseCase: GetMatchStatisticsUseCase,
  ) {}

  getMatches(query?: GetMatchesQueryDto) {
    return this.getMatchesUseCase.execute(query)
  }

  getMatchStatistics(matchExternalId: string) {
    return this.getMatchStatisticsUseCase.execute(matchExternalId)
  }
}
