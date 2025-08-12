import { Injectable } from '@nestjs/common'

import { ExtractLogResult } from '@app/modules/logs/interfaces'

@Injectable()
export class ExtractFromLogHelper {
  execute(
    logContent: string,
    delimiterPattern: RegExp,
    patterns: { name: string; regex: RegExp }[],
  ): ExtractLogResult[] {
    const logContentWithBreaks = logContent.replace(
      new RegExp(delimiterPattern, 'g'),
      '\n$&',
    )

    const lines = logContentWithBreaks
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const results: ExtractLogResult[] = []

    for (const line of lines) {
      const found: ExtractLogResult['found'] = []

      for (const { name, regex } of patterns) {
        const match = line.match(regex)
        if (match) {
          const groups =
            match.groups && Object.keys(match.groups).length > 0
              ? match.groups
              : undefined

          found.push({
            pattern: name,
            match: match[0],
            groups,
          })
        }
      }

      if (found.length > 0) {
        results.push({ line, found })
      }
    }

    return results
  }
}
