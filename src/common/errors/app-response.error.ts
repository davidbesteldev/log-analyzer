import { HttpStatus } from '@nestjs/common'

export class AppErrorResponse {
  public readonly statusCode: number
  public readonly message: string
  public readonly timestamp: string
  public readonly path: string

  constructor(statusCode: number, message: string, path: string) {
    this.statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR
    this.message = message || 'Internal Server Error'
    this.timestamp = new Date().toISOString()
    this.path = path
  }
}
