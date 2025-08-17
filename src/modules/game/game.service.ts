import { Injectable } from '@nestjs/common'

import { GetRankingByMatchUseCase } from '@app/modules/game/use-cases'

@Injectable()
export class GameService {
  constructor(private readonly getRankingByMatchUseCase: GetRankingByMatchUseCase) {}

  getRankingByMatch(matchExternalId: string) {
    return this.getRankingByMatchUseCase.execute(matchExternalId)
  }
}
