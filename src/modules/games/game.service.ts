import { Injectable } from '@nestjs/common'

import { GetMatchStatisticsUseCase } from '@app/modules/games/use-cases'

@Injectable()
export class GameService {
  constructor(private readonly getMatchStatisticsUseCase: GetMatchStatisticsUseCase) {}

  getMatchStatistics(matchExternalId: string) {
    return this.getMatchStatisticsUseCase.execute(matchExternalId)
  }
}
