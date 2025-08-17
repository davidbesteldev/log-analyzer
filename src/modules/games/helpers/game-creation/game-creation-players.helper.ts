import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { CreateMatchDTO } from '@app/modules/games/dto'
import { PlayerRepository } from '@app/modules/games/repositories'

@Injectable()
export class GameCreationPlayersHelper {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute(matches: CreateMatchDTO[], tx?: Prisma.TransactionClient) {
    const playerModel = tx?.player || this.playerRepository.model

    const playerNamesArray = [
      ...new Set(matches.flatMap((p) => p.kills.flatMap((k) => [k.killer, k.victim]))),
    ]

    const existingPlayers = await playerModel.findMany({
      where: { name: { in: playerNamesArray } },
      select: { name: true },
    })
    const existingPlayersNames = new Set(existingPlayers.map((p) => p.name))

    const newPlayersToCreate = playerNamesArray
      .filter((name) => !existingPlayersNames.has(name))
      .map((name) => ({ name }))

    if (newPlayersToCreate.length) {
      await playerModel.createMany({ data: newPlayersToCreate })
    }

    const players = await playerModel.findMany({
      where: { name: { in: playerNamesArray } },
      select: { id: true, name: true },
    })

    const playerMap = new Map(players.map((p) => [p.name, p.id]))
    return { playerMap }
  }
}
