import { observe } from './observer/index'

export function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(nValue) {
      vm[source][key] = nValue
    },
  })
}

function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data

  // 实现访问 vm.xxx 代理到 vm._data.xxx
  for (let key of Object.keys(data)) {
    proxy(vm, '_data', key)
  }

  observe(data)
}
