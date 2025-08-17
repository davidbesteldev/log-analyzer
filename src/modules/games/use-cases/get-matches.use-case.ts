import { Injectable } from '@nestjs/common'

import { GetMatchesQueryDto } from '@app/modules/games/dto'
import { MatchRepository } from '@app/modules/games/repositories'

@Injectable()
export class GetMatchesUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(query?: GetMatchesQueryDto) {
    return this.matchRepository.findManyPaginated(query)
  }
}
