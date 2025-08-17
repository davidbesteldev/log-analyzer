import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export class DateUtil {
  static format(date: string | Date, format: string) {
    return dayjs(date, format).toDate()
  }
}
