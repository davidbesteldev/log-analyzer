import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { BaseRepository } from '@app/common/database/repositories/base.repository'

import { DatabaseService } from '@app/database/database.service'

@Injectable()
export class MatchRepository extends BaseRepository<Prisma.MatchDelegate> {
  constructor(private readonly prismaService: DatabaseService) {
    super(prismaService.match)
  }
}
