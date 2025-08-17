import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { BaseRepository } from '@app/common/database/repositories/base.repository'

import { DatabaseService } from '@app/database/database.service'

@Injectable()
export class MatchSummaryRepository extends BaseRepository<Prisma.MatchSummaryDelegate> {
  constructor(private readonly prismaService: DatabaseService) {
    super(prismaService.matchSummary)
  }
}
