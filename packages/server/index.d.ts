type UnwrapPromise<T> = T extends PromiseLike<infer U> ? U : T

type PromiseReturnType<T extends () => Promise<infer V>> = V
