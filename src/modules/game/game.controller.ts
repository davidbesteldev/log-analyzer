import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { GameService } from './game.service'

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/matches/:id/ranking')
  @ApiOperation({ summary: 'Buscar ranking por partida' })
  getRankingByMatch(@Param('id') externalMatchId: string) {
    return this.gameService.getRankingByMatch(externalMatchId)
  }
}
