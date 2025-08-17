import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { DateUtil } from '@app/common/utils/date.util'

import { CreateMatchDTO } from '@app/modules/games/dto'
import { KillRepository } from '@app/modules/games/repositories'

@Injectable()
export class GameCreationKillsHelper {
  constructor(private readonly killRepository: KillRepository) {}

  async execute(
    match: CreateMatchDTO,
    playerMap: Map<string, number>,
    tx?: Prisma.TransactionClient,
  ) {
    const killModel = tx?.kill || this.killRepository.model

    const existingKills = await killModel.findMany({
      where: { matchExternalId: match.externalId },
    })

    const existingKillSet = new Set(
      existingKills.map(
        (kill) =>
          `${kill.killerId}-${kill.victimId}-${DateUtil.formatToString(kill.timestamp, 'DD/MM/YYYY HH:mm:ss')}`,
      ),
    )

    const newKills = match.kills.filter((kill) => {
      const killerId = playerMap.get(kill.killer)
      const victimId = playerMap.get(kill.victim)

      if (!killerId || !victimId) return false

      const killIdentifier = `${killerId}-${victimId}-${kill.timestamp}`
      return !existingKillSet.has(killIdentifier)
    })

    if (newKills.length === 0) return []

    return killModel.createMany({
      data: newKills.map((kill) => ({
        matchExternalId: match.externalId,
        killerId: playerMap.get(kill.killer)!,
        victimId: playerMap.get(kill.victim)!,
        weapon: kill.weapon,
        method: kill.method,
        killType: kill.type,
        timestamp: DateUtil.format(kill.timestamp, 'DD/MM/YYYY HH:mm:ss'),
      })),
    })
  }
}
