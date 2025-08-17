import { Injectable } from '@nestjs/common'

import { DatabaseService } from '@app/database/database.service'

import { CreateMatchDTO } from '@app/modules/games/dto'
import { GameCreationKillsHelper } from '@app/modules/games/helpers/game-creation/game-creation-kills.helper'
import { GameCreationMatchSummaryHelper } from '@app/modules/games/helpers/game-creation/game-creation-match-summary.helper'
import { GameCreationMatchHelper } from '@app/modules/games/helpers/game-creation/game-creation-match.helper'
import { GameCreationPlayersHelper } from '@app/modules/games/helpers/game-creation/game-creation-players.helper'

@Injectable()
export class GameCreationHelper {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly gameCreationPlayersHelper: GameCreationPlayersHelper,
    private readonly gameCreationMatchHelper: GameCreationMatchHelper,
    private readonly gameCreationKillsHelper: GameCreationKillsHelper,
    private readonly gameCreationMatchSummary: GameCreationMatchSummaryHelper,
  ) {}

  async execute(matches: CreateMatchDTO[]) {
    const { createdMatchIds, playerMap } = await this.dbService.$transaction(
      async (tx) => {
        const { playerMap } = await this.gameCreationPlayersHelper.execute(matches, tx)

        const createdMatchIds: { id: number; externalId: string }[] = []
        const allMatchOperations = matches.map(async (match) => {
          const [createdMatch, _] = await Promise.all([
            this.gameCreationMatchHelper.execute(match, tx),
            this.gameCreationKillsHelper.execute(match, playerMap, tx),
          ])

          createdMatchIds.push(createdMatch)
        })

        await Promise.all(allMatchOperations)
        return { createdMatchIds, playerMap }
      },
    )

    await this.dbService.$transaction(async (tx) => {
      const allSummaryOperations = createdMatchIds.map(async ({ id, externalId }) => {
        const originalMatchData = matches.find((m) => m.externalId === externalId)
        if (!originalMatchData) return

        await this.gameCreationMatchSummary.execute(originalMatchData, id, playerMap, tx)
      })

      await Promise.all(allSummaryOperations)
    })
  }
}
