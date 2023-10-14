let activeEffect

const effectStack = []
const bucket = new WeakMap()
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn)

    activeEffect = effectFn
    
    effectStack.push(effectFn)
    fn()

    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }
  effectFn.deps = []
  effectFn()
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

const data = {
  text: 'Hello World',
}

const obj = new Proxy(data, {
  get(target, key) {
    truck(target, key)
    return target[key]
  },
  set(target, key, newValue) {
    target[key] = newValue
    trigger(target, key)
    return true
  },
})

function truck(target, key) {
  if (!activeEffect) return

  let depsMap = bucket.get(target)

  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }

  let deps = depsMap.get(key)

  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }

  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  const effectToRun = new Set()

  effects && effects.forEach(effectFn => {
    if(effectFn !== activeEffect) {
      effectToRun.add(effectFn)
    }
  })

  effectToRun.forEach((fn) => fn())
}

effect(() => {
  document.body.innerText = obj.text
})

setTimeout(() => {
  obj.text = 'asd'
}, 1000)
