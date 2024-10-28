const { SyncWaterfallHook } = require('tapable')

const hooks = new SyncWaterfallHook(['user', 'name'])

// 如果 hooks 返回值 result != undefined，则后面的 tap2 tap3 的第一个参数都是返回的 result
hooks.tap('tap1', (a, b) => {
  console.log(a, b)
  return '测试'
})

hooks.tap('tap2', (a, b) => {
  console.log(a, b)
  return '修改值'
})

hooks.tap('tap3', (a, b) => {
  console.log(a, b)
})


hooks.call('test')
