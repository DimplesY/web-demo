const { SyncBailHook } = require('tapable')

const hook = new SyncBailHook(['arg1', 'arg2'])

hook.tap('tap1', (a, b) => {
  console.log('返回 undefined', a, b)
})

hook.tap('tap2', (a, b) => {
  console.log('返回 false', a, b)
  return false
})

hook.tap('tap3', (a, b) => {
  console.log('不会执行到这里', a, b)
})

hook.call('foo', 'bar')
