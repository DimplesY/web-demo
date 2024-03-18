function curry(fn: Function) {
  const arglen = fn.length
  return function fn1(...args1: any[]) {
    if (args1.length >= arglen) {
      return fn.apply(fn, args1)
    } else {
      const fn2 = function (...args2: any[]) {
        return fn1.apply(fn, args1.concat(args2))
      }
      return fn2
    }
  }
}

