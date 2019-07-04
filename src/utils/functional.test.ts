import { isNil, prop, propEq } from './functional'

describe('isNil()', () => {
  test('returns true on null/undefined', () => {
    expect(isNil(null)).toEqual(true)
    expect(isNil(undefined)).toEqual(true)
  })

  test('returns false on values', () => {
    expect(isNil('')).toEqual(false)
    expect(isNil(123)).toEqual(false)
    expect(isNil(0)).toEqual(false)
    expect(isNil({ foo: 'bar' })).toEqual(false)
  })
})

describe('prop()', () => {
  const obj = {
    foo: 'bar',
    biz: 'baz',
  }

  test('returns property value', () => {
    expect(prop<typeof obj, 'foo'>('foo')(obj)).toEqual('bar')
    expect(prop<typeof obj, 'biz'>('biz')(obj)).toEqual('baz')
    expect([obj, obj].map(prop('foo'))).toEqual(['bar', 'bar'])
  })

  test("returns null if property doesn't exist", () => {
    expect(prop<any, string>('prop')(obj)).toBeNull()
  })
})

describe('propEq()', () => {
  const obj = {
    foo: 'bar',
    biz: 'baz',
  }

  test('returns if property equals value', () => {
    expect(propEq<typeof obj, 'foo'>('foo', 'bar')(obj)).toBe(true)
    expect(propEq<typeof obj, 'biz'>('biz', 'baz')(obj)).toBe(true)

    expect(propEq<typeof obj, 'biz'>('biz', 'not_baz')(obj)).toBe(false)
    expect(propEq<typeof obj, 'foo'>('foo', 'not_bar')(obj)).toBe(false)

    expect([obj, obj].every(propEq('foo', 'bar'))).toBe(true)
  })
})
