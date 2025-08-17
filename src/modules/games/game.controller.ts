import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { GetMatchesQueryDto, GetMatchesResponseDto } from '@app/modules/games/dto'

import { GameService } from './game.service'

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/matches')
  @ApiOperation({
    tags: ['Games'],
    summary: 'Buscar partidas',
  })
  @ApiOkResponse({ type: GetMatchesResponseDto })
  getMatches(@Query() query: GetMatchesQueryDto) {
    return this.gameService.getMatches(query)
  }

  @Get('/matches/:externalId/statistics')
  @ApiOperation({
    tags: ['Games'],
    summary: 'Buscar estatísticas da partida',
    description: 'Ira realizar a busca de estatísticas da partida através do id externo.',
  })
  getRankingByMatch(@Param('externalId') matchExternalId: string) {
    return this.gameService.getMatchStatistics(matchExternalId)
  }
}
