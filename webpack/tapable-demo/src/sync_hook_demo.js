const { SyncHook } = require('tapable')

const hook = new SyncHook(['user', 'name'])

hook.tap('tap1', (a, b) => {
  console.log('tap1', a, b)
})

hook.tap('tap2', (a, b) => {
  console.log('tap2', a, b)
})


hook.tap('tap3', (a, b) => {
  console.log('tap3', a, b)
})


hook.call('foo', 'bar')
