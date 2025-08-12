import { OriginalEnv } from '@app/config'

export const buildOriginalEnv = (): OriginalEnv => ({
  NODE_ENV: 'test',
  PORT: 3000,
  DATABASE_URL: 'file:./dev.db/mock',
})
