class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
  }
}

function defineReactive(data, key, value) {
  // 递归实现深度对象监视
  observe(value)
  // 劫持
  Object.defineProperty(data, key, {
    get() {
      console.log('取值')
      return value
    },
    set(nValue) {
      console.log('设置值')
      if (value === nValue) return
      value = nValue
    },
  })
}

export function observe(data) {
  // 只对对象进行劫持
  if (typeof data !== 'object' || data === null) {
    return
  }

  return new Observer(data)
}
