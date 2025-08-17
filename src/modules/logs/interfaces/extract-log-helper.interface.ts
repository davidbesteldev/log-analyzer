export interface ExtractLogResult {
  timestamp: string
  line: string
  found: {
    pattern: string
    match: string | null
    groups?: Record<string, string>
  }[]
}
