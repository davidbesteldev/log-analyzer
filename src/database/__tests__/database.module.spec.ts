import { createTestingModuleWithGlobals } from '@app/common/tests/helpers/create-testing-module-with-globals'

import { DatabaseModule } from '../database.module'
import { DatabaseService } from '../database.service'

describe('DatabaseModule', () => {
  let sut: DatabaseService

  beforeEach(async () => {
    const moduleRef = await createTestingModuleWithGlobals({
      imports: [DatabaseModule],
    })

    sut = moduleRef.get<DatabaseService>(DatabaseService)
  })

  it('should provide DatabaseService', () => {
    expect(sut).toBeDefined()
    expect(sut.constructor).toBe(DatabaseService)
  })
})
