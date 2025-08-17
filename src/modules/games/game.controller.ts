import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { GameService } from './game.service'

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

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
