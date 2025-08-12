import { createTestingModuleWithGlobals } from '@app/common/tests/helpers/create-testing-module-with-globals'

import { ExtractFromLogHelper } from './extract-from-log.helper'

describe('ExtractFromLogHelper', () => {
  let sut: ExtractFromLogHelper

  beforeAll(async () => {
    const module = await createTestingModuleWithGlobals({
      providers: [ExtractFromLogHelper],
    })

    sut = module.get<ExtractFromLogHelper>(ExtractFromLogHelper)
  })

  const delimiterPattern = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
  const patterns = [
    { name: 'match-start', regex: /New match (?<id>\d+) has started/ },
    { name: 'kill', regex: /(?<killer>\w+) killed (?<victim>\w+)/ },
    { name: 'match-end', regex: /Match (?<id>\d+) has ended/ },
  ]

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should split log content into lines by delimiter and extract matching patterns', () => {
    const logContent =
      '23/04/2019 15:34:22 - New match 11348965 has started 23/04/2019 15:36:04 - Roman killed Nick using M16 23/04/2019 15:39:22 - Match 11348965 has ended'

    const results = sut.execute(logContent, delimiterPattern, patterns)

    expect(results).toHaveLength(3)

    expect(results[0].line).toContain('New match 11348965 has started')
    expect(results[0].found[0].pattern).toBe('match-start')
    expect(results[0].found[0].groups).toEqual({ id: '11348965' })

    expect(results[1].line).toContain('Roman killed Nick')
    expect(results[1].found[0].pattern).toBe('kill')
    expect(results[1].found[0].groups).toEqual({ killer: 'Roman', victim: 'Nick' })

    expect(results[2].line).toContain('Match 11348965 has ended')
    expect(results[2].found[0].pattern).toBe('match-end')
    expect(results[2].found[0].groups).toEqual({ id: '11348965' })
  })

  it('should return empty array if no patterns match', () => {
    const logContent =
      '23/04/2019 15:34:22 - Some unrelated log line 23/04/2019 15:36:04 - Another line'

    const results = sut.execute(logContent, delimiterPattern, patterns)

    expect(results).toEqual([])
  })

  it('should trim lines and ignore empty lines', () => {
    const logContent =
      '  23/04/2019 15:34:22 - New match 123 has started\n\n 23/04/2019 15:36:04 - Roman killed Nick '

    const results = sut.execute(logContent, delimiterPattern, patterns)

    expect(results).toHaveLength(2)
    expect(results[0].line.startsWith('23/04/2019')).toBe(true)
    expect(results[1].line).toContain('Roman killed Nick')
  })

  it('should handle logs that already have new lines', () => {
    const logContent = `23/04/2019 15:34:22 - New match 1 has started
23/04/2019 15:36:04 - Roman killed Nick
23/04/2019 15:39:22 - Match 1 has ended`

    const results = sut.execute(logContent, delimiterPattern, patterns)

    expect(results).toHaveLength(3)
  })

  it('should handle multiple matches per line', () => {
    const customPatterns = [
      { name: 'kill', regex: /(?<killer>\w+) killed (?<victim>\w+)/g },
      { name: 'weapon', regex: /using (?<weapon>\w+)/g },
    ]

    const logContent = '23/04/2019 15:36:04 - Roman killed Nick using M16'

    const results = sut.execute(logContent, delimiterPattern, customPatterns)

    expect(results).toHaveLength(1)
    expect(results[0].found.some((f) => f.pattern === 'kill')).toBe(true)
    expect(results[0].found.some((f) => f.pattern === 'weapon')).toBe(true)
  })
})
