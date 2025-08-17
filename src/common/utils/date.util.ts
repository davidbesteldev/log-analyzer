import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export class DateUtil {
  static format(date: string | Date, format: string) {
    return dayjs(date, format).toDate()
  }

  static formatToString(date: Date | string, format: string): string {
    return dayjs(date).format(format)
  }

  static getTimestampFromString(dateString: string, format: string): number {
    return dayjs(dateString, format).valueOf()
  }

  static diffInMinutes(
    startDateString: string,
    endDateString: string,
    format: string,
  ): number {
    const startDate = dayjs(startDateString, format)
    const endDate = dayjs(endDateString, format)
    return endDate.diff(startDate, 'minute', true)
  }
}
