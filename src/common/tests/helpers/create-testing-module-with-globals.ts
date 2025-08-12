import { Test, TestingModule } from '@nestjs/testing'

import { EnvModule } from '@app/config'

export async function createTestingModuleWithGlobals(
  metadata: Parameters<typeof Test.createTestingModule>[0],
): Promise<TestingModule> {
  return Test.createTestingModule({
    ...metadata,
    imports: [EnvModule, ...(metadata.imports || [])],
  }).compile()
}
