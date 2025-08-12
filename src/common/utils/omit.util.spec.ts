import { omit } from './omit.util'

describe('omit', () => {
  it('should remove the specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, ['b', 'c'])
    expect(result).toEqual({ a: 1 })
  })

  it('should not modify the original object', () => {
    const obj = { a: 1, b: 2 }
    omit(obj, ['a'])
    expect(obj).toEqual({ a: 1, b: 2 })
  })

  it('should return the same object when no keys are provided', () => {
    const obj = { a: 1, b: 2 }
    const result = omit(obj, [])
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should ignore keys that do not exist in the object', () => {
    const obj = { a: 1, b: 2 }
    const result = omit(obj, ['x' as keyof typeof obj])
    expect(result).toEqual({ a: 1, b: 2 })
  })
})
