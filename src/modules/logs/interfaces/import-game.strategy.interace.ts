import {
  KillMethodEnum,
  KillTypeEnum,
} from '@app/modules/games/repositories/enums/kill.enum'

export interface IGroupLogByMatch {
  externalId: string
  startTime: string
  endTime: string
  kills: {
    killer: string
    victim: string
    weapon: string
    method: KillMethodEnum
    type: KillTypeEnum
    timestamp: string
  }[]
}
