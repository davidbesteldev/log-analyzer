export interface ExtractLogResult {
  line: string
  found: {
    pattern: string
    match: string | null
    groups?: Record<string, string>
  }[]
}
