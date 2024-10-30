function createEventHook<T = any>() {

  const fns = new Set<Function>()


  function off(fn: Function) {
    fns.delete(fn)
  }

  function trigger(...args: T[]) {
    for (const fn of fns) {
      fn(...args)
    }
  }

  function on(fn: Function) {
    fns.add(fn)
    return () => off(fn)
  }


  return {
    off,
    on,
    trigger
  }

}

const hooks = createEventHook<string>()

hooks.on(res => {
  console.log(res)
})

setTimeout(() => {
  hooks.trigger('hello')
}, 1000);
