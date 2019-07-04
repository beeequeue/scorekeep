export const isNil = (variable: any): variable is null | undefined => {
  return variable === null || variable === undefined
}

export const prop = <O extends {}, P extends keyof O>(prop: P) => (obj: O) =>
  obj[prop] || null

export const propEq = <O extends {}, P extends keyof O>(
  prop: P,
  value: O[P],
) => (obj: O) => obj[prop] === value
