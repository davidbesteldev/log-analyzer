import { buildOriginalEnv } from '@app/common/tests/__fixtures__/env.fixture'

import { envConfig, originalEnv } from '@app/config/env/env.config'

const envValidation = (config: Record<string, unknown>) => {
  if (config?.NODE_ENV === 'test') {
    Object.assign(config, buildOriginalEnv())
  }

  const parsed = originalEnv.safeParse(config)
  if (!parsed.success) throw new Error(parsed.error.message)

  return envConfig.parse(parsed.data)
}

export { envValidation }
