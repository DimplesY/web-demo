const intercepters = []


export function registerInterceptor(interceptor) {
  intercepters.push(interceptor)
}

export function intercept(promise) {
  return Promise.resolve(promise).then(value => {
    for (let interceptor of intercepters) {
      value = interceptor(value)
    }
    return value
  })
}

const promise = Promise.resolve(1)
registerInterceptor(value => value + 1)
registerInterceptor(value => value * 2)
intercept(promise).then(console.log)

