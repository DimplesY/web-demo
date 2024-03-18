
function memoize(fn: Function) {
  const cache: Record<string, any> = {}

  return function (...args) {
    const args_str = JSON.stringify(args)
    cache[args_str] = cache[args_str] || fn.apply(fn, args)
    return cache[args_str]
  }
}

