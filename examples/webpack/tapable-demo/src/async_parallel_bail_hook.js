const { AsyncParallelBailHook } = require('tapable')

const hook = new AsyncParallelBailHook(['arg1', 'arg2'])

hook.tapAsync('tap1', (a, b, callback) => {
  setTimeout(() => {
    console.log('tap1', a, b)
    callback(1)
  }, 2000)
})

hook.tapAsync('tap2', (a, b, callback) => {
  setTimeout(() => {
    console.log('tap2', a, b)
    callback(2)
  }, 1000)
})

hook.callAsync('1', '2', (err, ret) => {
  console.log('err', err)
  console.log('ret', ret)
})
