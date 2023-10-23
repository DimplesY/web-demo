const { SyncLoopHook } = require('tapable')

const hook = new SyncLoopHook(['arg1', 'arg2'])

let count = 3
hook.tap('tap1', (a, b) => {
  console.log('tap1', a, b)
  if (count <= 0) return
  return count--
})
hook.tap('tap2', (a, b) => {
  console.log('tap2', a, b)
})
hook.tap('tap3', (a, b) => {
  console.log('tap3', a, b)
})

hook.call('1', '2')
