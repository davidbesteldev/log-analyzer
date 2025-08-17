import { Injectable } from '@nestjs/common'

import { GetRankingByMatchUseCase } from '@app/modules/games/use-cases'

@Injectable()
export class GameService {
  constructor(private readonly getRankingByMatchUseCase: GetRankingByMatchUseCase) {}

  getRankingByMatch(matchExternalId: string) {
    return this.getRankingByMatchUseCase.execute(matchExternalId)
  }
}
