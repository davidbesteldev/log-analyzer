import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { BaseRepository } from '@app/common/database/repositories/base.repository'

import { DatabaseService } from '@app/database/database.service'

@Injectable()
export class KillRepository extends BaseRepository<Prisma.KillDelegate> {
  constructor(private readonly prismaService: DatabaseService) {
    super(prismaService.kill)
  }
}
