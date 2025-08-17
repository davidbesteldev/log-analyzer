import { Injectable } from '@nestjs/common'

import { GetRankingByMatchUseCase } from '@app/modules/game/use-cases'

@Injectable()
export class GameService {
  constructor(private readonly getRankingByMatchUseCase: GetRankingByMatchUseCase) {}

  getRankingByMatch(externalMatchId: string) {
    return this.getRankingByMatchUseCase.execute(externalMatchId)
  }
}
