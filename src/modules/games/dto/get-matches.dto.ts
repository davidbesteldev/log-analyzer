import { PaginationMetaDto, QueryPaginationDto } from '@app/common/dto'

import { MatchEntity } from '@app/modules/games/repositories/entities/match.entity'

export class GetMatchesQueryDto extends QueryPaginationDto {}

export class GetMatchesResponseDto {
  data: MatchEntity[]
  meta: PaginationMetaDto
}
