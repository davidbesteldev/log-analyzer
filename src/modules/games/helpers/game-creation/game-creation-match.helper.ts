import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { DateUtil } from '@app/common/utils/date.util'

import { CreateMatchDTO } from '@app/modules/games/dto'
import { MatchRepository } from '@app/modules/games/repositories'

@Injectable()
export class GameCreationMatchHelper {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(match: CreateMatchDTO, tx?: Prisma.TransactionClient) {
    const matchModel = tx?.match || this.matchRepository.model

    return matchModel.upsert({
      where: { externalId: match.externalId },
      update: {
        endTime: DateUtil.format(match.endTime, 'DD/MM/YYYY HH:mm:ss'),
      },
      create: {
        externalId: match.externalId,
        startTime: DateUtil.format(match.startTime, 'DD/MM/YYYY HH:mm:ss'),
        endTime: DateUtil.format(match.endTime, 'DD/MM/YYYY HH:mm:ss'),
      },
      select: { id: true, externalId: true },
    })
  }
}
