function createEventHook() {

  const fns = new Set()


  function off(fn) {
    fns.delete(fn)
  }

  function trigger(...args) {
    for (const fn of fns) {
      fn(...args)
    }
  }

  function on(fn) {
    fns.add(fn)
    return () => off(fn)
  }


  return {
    off,
    on,
    trigger
  }

}



const hooks = createEventHook()


hooks.on(res => {
  console.log(res)
})

setTimeout(() => {
  hooks.trigger('hello')
}, 1000);
