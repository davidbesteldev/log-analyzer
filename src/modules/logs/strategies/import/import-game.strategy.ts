import { Injectable } from '@nestjs/common'

import { REGEX_DATE_TIME } from '@app/common/constants'

import { WORLD_KILLER } from '@app/modules/games/constants'
import { GameCreationHelper } from '@app/modules/games/helpers/game-creation'
import {
  KillMethodEnum,
  KillTypeEnum,
} from '@app/modules/games/repositories/enums/kill.enum'
import { ImportTypeEnum } from '@app/modules/logs/enums'
import { ExtractFromLogHelper } from '@app/modules/logs/helpers'
import {
  ExtractLogResult,
  IGroupLogByMatch,
  IImportStrategy,
} from '@app/modules/logs/interfaces'

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

@Injectable()
export class ImportGameStrategy implements IImportStrategy {
  constructor(
    private readonly extractFromLogHelper: ExtractFromLogHelper,
    private readonly gameCreationHelper: GameCreationHelper,
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
    await this.gameCreationHelper.execute(groupedLogsByMatch)
  }

  private groupLogsByMatch(logs: ExtractLogResult[]): IGroupLogByMatch[] {
    const [matchStartPattern, matchEndPattern, killPattern, environmentKillPattern] =
      PATTERNS.map((p) => p.name)

    const matches: IGroupLogByMatch[] = []
    let currentMatch: IGroupLogByMatch | null = null

    for (const log of logs) {
      const foundData = log.found[0]
      if (!foundData || !foundData.groups) continue

      const { pattern, groups } = foundData
      switch (pattern) {
        case matchStartPattern:
          if (currentMatch) {
            matches.push(currentMatch)
          }
          currentMatch = {
            externalId: groups.id,
            startTime: log.timestamp,
            endTime: '',
            kills: [],
          }
          break

        case killPattern:
          if (currentMatch) {
            currentMatch.kills.push({
              killer: groups.killer,
              victim: groups.victim,
              weapon: groups.weapon,
              method: KillMethodEnum.WEAPONSHOT,
              type: KillTypeEnum.PLAYER,
              timestamp: log.timestamp,
            })
          }
          break

        case environmentKillPattern:
          if (currentMatch) {
            currentMatch.kills.push({
              killer: WORLD_KILLER,
              victim: groups.victim,
              weapon: groups.weapon,
              method: KillMethodEnum.DROWN,
              type: KillTypeEnum.ENVIRONMENT,
              timestamp: log.timestamp,
            })
          }
          break

        case matchEndPattern:
          if (currentMatch && currentMatch.externalId === groups.id) {
            currentMatch.endTime = log.timestamp
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
}
