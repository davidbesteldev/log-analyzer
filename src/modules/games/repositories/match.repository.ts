import { Injectable } from '@nestjs/common'
import { Match, Prisma } from '@prisma/client'

import { BaseRepository } from '@app/common/database/repositories/base.repository'
import { paginate, paginateOutput } from '@app/common/database/utils/pagination.utils'
import { QueryPaginationDto } from '@app/common/dto'

import { DatabaseService } from '@app/database/database.service'

@Injectable()
export class MatchRepository extends BaseRepository<Prisma.MatchDelegate> {
  constructor(private readonly prismaService: DatabaseService) {
    super(prismaService.match)
  }

  async findManyPaginated(query?: QueryPaginationDto, args?: Prisma.MatchFindManyArgs) {
    const [data, total] = await Promise.all([
      await this.model.findMany({
        ...args,
        ...paginate(query),
        orderBy: { createdAt: query?.order },
      }),
      await this.model.count({ where: args?.where }),
    ])

    return paginateOutput<Match>(data, total, query)
  }
}
