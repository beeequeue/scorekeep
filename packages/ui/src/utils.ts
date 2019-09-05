export const isNil = <T>(
  variable: T | null | undefined,
): variable is null | undefined => variable === null || variable === undefined

export const isNotNil = <T>(variable: T | null | undefined): variable is T =>
  !isNil(variable)

export const clamp = (x: number, min: number, max: number) =>
  Math.max(min, Math.min(x, max))

export const enumToArray = <E>(Enum: E): E[] => Object.values(Enum)

export const enumKeysToArray = <E>(Enum: E): Array<keyof E> =>
  Object.keys(Enum) as any

export const isOfType = <T>(
  obj: any,
  ...properties: Array<keyof T>
): obj is T => properties.every(p => !isNil(obj[p]))

export const isOfTypename = <T extends { __typename?: string }>(
  obj: any,
  typename: T['__typename'],
): obj is T => obj.__typename === typename

export const arrayIsOfType = <T>(
  arr: any[],
  ...properties: Array<keyof T>
): arr is T[] =>
  Array.isArray(arr) && arr.every(item => isOfType<any>(item, ...properties))

export const delay = async (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const T = () => true

export const prop = <O extends {}, P extends keyof O>(prop: P) => (obj: O) =>
  obj[prop]

export const propEq = <O extends {}, P extends keyof O>(
  prop: P,
  value: O[P],
) => (obj: O) => obj[prop] === value

export const complement = (fn: (...a: any[]) => any) => (input: any) =>
  !fn(input)

export const mapAsync = async <T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
) => {
  const promises = items.map(fn)

  return await Promise.all(promises)
}

export const anyPass = <
  P,
  F extends Array<(item: P, index?: number, array?: P[]) => boolean>
>(
  item: P,
  predicates: F,
) => predicates.some(predicate => predicate(item))

export const pick = <T extends {}, K extends Array<keyof T>>(
  obj: T,
  keys: K,
): Pick<T, K[number]> =>
  Object.entries(obj)
    .filter(([key]) => keys.includes(key as any))
    .reduce<Pick<T, K[number]>>(
      (obj, [key, val]) => Object.assign(obj, { [key]: val }),
      {} as any,
    )

export const omit = <T extends {}, K extends Array<keyof T>>(
  obj: T,
  keys: K,
): Omit<T, K[number]> =>
  Object.entries(obj)
    .filter(([key]) => !keys.includes(key as any))
    .reduce<Pick<T, K[number]>>(
      (obj, [key, val]) => Object.assign(obj, { [key]: val }),
      {} as any,
    )

export const debounce = <P extends Array<any>>(
  func: (...a: P) => any,
  ms: number,
  immediate = false,
) => {
  let timeout: number | null = null

  return (...input: P) => {
    const later = function() {
      timeout = null
      if (!immediate) {
        func(...input)
      }
    }

    window.clearTimeout(timeout!)
    timeout = window.setTimeout(later, ms)

    const callNow = immediate && !timeout
    if (callNow) {
      func(...input)
    }
  }
}

export const countdown = (
  seconds: number,
  fn: (secondsLeft: number) => void,
) => {
  let _seconds = seconds

  fn(_seconds)

  const interval = window.setInterval(() => {
    _seconds--

    if (_seconds < 0) {
      window.clearInterval(interval)
      return
    }

    fn(_seconds)
  }, 1000)
}
