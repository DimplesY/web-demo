const { AsyncParallelHook } = require('tapable')

const hook = new AsyncParallelHook(['arg1', 'arg2'])

hook.tapAsync('tap1', (a, b, callback) => {
  setTimeout(() => {
    console.log('tap1', a, b)
    callback()
  }, 1000)
})

hook.tapPromise('tap2', (a, b) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('tap2', a, b)
      resolve()
    }, 500)
  })
})


hook.callAsync('1', '2', (err, ret) => {
  console.log('err', err)
  console.log('ret', ret)
})
