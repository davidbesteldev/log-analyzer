import { PaginateOutput } from '@app/common/database/utils/pagination.utils'
import { EntityFaker } from '@app/common/tests/fakers/entity.faker'

export function buildPaginateOutput<T extends object>(
  Entity: new () => T,
  pageSize: number,
): PaginateOutput<T> {
  const data = new EntityFaker(Entity).fakeList(pageSize)
  const total = data.length

  return {
    data,
    meta: {
      currentPage: 1,
      lastPage: Math.ceil(total / pageSize),
      total,
      totalPerPage: pageSize,
      nextPage: total > pageSize ? 2 : null,
      prevPage: null,
    },
  }
}
