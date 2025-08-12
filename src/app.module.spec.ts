import { INestApplication } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { AppModule } from '@app/app.module'

import { createTestingModuleWithGlobals } from '@app/common/tests/helpers/create-testing-module-with-globals'

describe('AppModule', () => {
  let app: INestApplication

  beforeEach(() => {
    jest.spyOn(PrismaClient.prototype, '$connect').mockResolvedValue()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should load AppModule correctly', async () => {
    const sut = await createTestingModuleWithGlobals({
      imports: [AppModule],
    })

    app = sut.createNestApplication()
    await app.init()

    expect(app).toBeDefined()
  })
})
