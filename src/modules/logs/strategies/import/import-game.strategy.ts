import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import { REGEX_DATE_TIME } from '@app/common/constants'
import { DateUtil } from '@app/common/utils/date.util'

import { DatabaseService } from '@app/database/database.service'

import { WORLD_KILLER } from '@app/modules/game/constants'
import { ImportTypeEnum } from '@app/modules/logs/enums'
import { ExtractFromLogHelper } from '@app/modules/logs/helpers'
import { ExtractLogResult, IImportStrategy } from '@app/modules/logs/interfaces'
import {
  KillMethodEnum,
  KillTypeEnum,
} from '@app/modules/logs/repositories/enums/kill.enum'

interface IGroupLogByMatch {
  logId: string
  startTime: string
  endTime: string
  kills: {
    killer: string
    victim: string
    weapon: string
    method: KillMethodEnum
    type: KillTypeEnum
  }[]
}

const PATTERNS = [
  { name: 'match-start', regex: /New match (?<id>\d+) has started/ },
  { name: 'match-end', regex: /Match (?<id>\d+) has ended/ },
  {
    name: 'kill',
    regex: /(?<killer>\w+) killed (?<victim>\w+) using (?<weapon>\w+)/,
  },
  {
    name: 'environment-kill',
    regex: new RegExp(`${WORLD_KILLER} killed (?<victim>\\w+) by (?<method>\\w+)`),
  },
]

const [MATCH_START_PATTERN, MATCH_END_PATTERN, KILL_PATTERN, ENVIRONMENT_KILL_PATTERN] =
  PATTERNS.map((p) => p.name)

@Injectable()
export class ImportGameStrategy implements IImportStrategy {
  constructor(
    private readonly extractFromLogHelper: ExtractFromLogHelper,
    private readonly databaseService: DatabaseService,
  ) {}

  getType(): ImportTypeEnum {
    return ImportTypeEnum.GAME
  }

  async handle(file: Express.Multer.File): Promise<void> {
    const extractedLogs = this.extractFromLogHelper.execute(
      file.buffer.toString('utf-8'),
      REGEX_DATE_TIME,
      PATTERNS,
    )

    const groupedLogsByMatch = this.groupLogsByMatch(extractedLogs)
    await this.insertData(groupedLogsByMatch)
  }

  private groupLogsByMatch(logs: ExtractLogResult[]): IGroupLogByMatch[] {
    const matches: IGroupLogByMatch[] = []
    let currentMatch: IGroupLogByMatch | null = null

    for (const log of logs) {
      const foundData = log.found[0]
      if (!foundData || !foundData.groups) continue

      const { pattern, groups } = foundData
      switch (pattern) {
        case MATCH_START_PATTERN:
          if (currentMatch) {
            matches.push(currentMatch)
          }
          currentMatch = {
            logId: groups.id,
            startTime: log.line.split(' - ')[0],
            endTime: '',
            kills: [],
          }
          break

        case KILL_PATTERN:
          if (currentMatch) {
            currentMatch.kills.push({
              killer: groups.killer,
              victim: groups.victim,
              weapon: groups.weapon,
              method: KillMethodEnum.WEAPONSHOT,
              type: KillTypeEnum.PLAYER,
            })
          }
          break

        case ENVIRONMENT_KILL_PATTERN:
          if (currentMatch) {
            currentMatch.kills.push({
              killer: WORLD_KILLER,
              victim: groups.victim,
              weapon: groups.weapon,
              method: KillMethodEnum.DROWN,
              type: KillTypeEnum.ENVIRONMENT,
            })
          }
          break

        case MATCH_END_PATTERN:
          if (currentMatch && currentMatch.logId === groups.id) {
            currentMatch.endTime = log.line.split(' - ')[0]
            matches.push(currentMatch)
            currentMatch = null
          }
          break

        default:
          break
      }
    }

    if (currentMatch) matches.push(currentMatch)
    return matches
  }

  private async insertData(partidas: IGroupLogByMatch[]) {
    await this.databaseService.$transaction(async (transaction) => {
      const allPlayersNames = new Set<string>()
      partidas.forEach((partida) => {
        partida.kills.forEach((kill) => {
          allPlayersNames.add(kill.killer)
          allPlayersNames.add(kill.victim)
        })
      })
      const playerNamesArray = Array.from(allPlayersNames)

      const existingPlayers = await transaction.player.findMany({
        where: { name: { in: playerNamesArray } },
        select: { name: true },
      })
      const existingPlayersNames = new Set(existingPlayers.map((p) => p.name))

      const newPlayersToCreate = playerNamesArray
        .filter((name) => !existingPlayersNames.has(name))
        .map((name) => ({ name }))

      if (newPlayersToCreate.length) {
        await transaction.player.createMany({ data: newPlayersToCreate })
      }

      const players = await transaction.player.findMany({
        where: { name: { in: playerNamesArray } },
        select: { id: true, name: true },
      })
      const playerMap = new Map(players.map((p) => [p.name, p.id]))

      const allOperations = partidas.flatMap((partida) => {
        const startTimeDate = DateUtil.format(partida.startTime, 'DD/MM/YYYY HH:mm:ss')
        const endTimeDate = DateUtil.format(partida.endTime, 'DD/MM/YYYY HH:mm:ss')

        const matchUpsert = transaction.match.upsert({
          where: { externalId: partida.logId },
          update: { endTime: endTimeDate },
          create: {
            externalId: partida.logId,
            startTime: startTimeDate,
            endTime: endTimeDate,
          },
        })

        const killCreation = transaction.kill.createMany({
          data: partida.kills.map((kill) => ({
            matchExternalId: partida.logId,
            killerId: playerMap.get(kill.killer)!,
            victimId: playerMap.get(kill.victim)!,
            weapon: kill.weapon,
            method: kill.method,
            killType: kill.type,
            timestamp: new Date(),
          })),
        })

        return [matchUpsert, killCreation]
      })

      await Promise.all(allOperations)
    })
  }
}
