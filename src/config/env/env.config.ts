import { z } from 'zod'

export const originalEnv = z.object({
  NODE_ENV: z.enum(['test', 'development', 'staging', 'production']).default('test'),
  PORT: z.coerce.number().optional().default(3000),
  DATABASE_URL: z.string().url(),
})

export const envConfig = originalEnv.transform((env) => ({
  app: {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
  },
  database: {
    url: env.DATABASE_URL,
  },
}))

export type OriginalEnv = z.infer<typeof originalEnv>
export type EnvConfig = z.infer<typeof envConfig>
