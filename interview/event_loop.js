setImmediate(() => {
  console.log('AAA')
})

setTimeout(() => {
  console.log('CCCC')
}, 0)

process.nextTick(() => {
  console.log('DDDD')
})

console.log('BBBB')
