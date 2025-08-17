import {
  KillMethodEnum,
  KillTypeEnum,
} from '@app/modules/games/repositories/enums/kill.enum'

export class CreateMatchDTO {
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
