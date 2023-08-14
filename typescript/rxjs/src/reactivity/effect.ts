let activeEffect: Function
const effect = (fn: Function) => {
  const _effect = () => {
    activeEffect = _effect
    fn()
  }
  _effect()
}

const targetMap = new WeakMap()
const track = (target: any, key: any) => {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  dep.add(activeEffect)
}

const tiger = (target: any, key: any) => {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  dep.forEach((effect: Function) => {
    effect()
  })
}
