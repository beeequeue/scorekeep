import { mapAsync } from '.'

test('mapAsync()', () => {
  const values = Array.from({ length: 10 }).map((_, i) => i)

  const result = mapAsync(values, async n => n * 2)

  expect(result).resolves.toEqual(values.map(n => n * 2))
})
