let a = {
  test: '123',
}

Object.defineProperty(a, 'test', {
  writable: false,
  enumerable: false,
  configurable: false,
  value: 1
})

for (const key in a) {
  console.log(key)
}

// 获取对象上所有属性的描述对象
console.log(Object.getOwnPropertyDescriptors(a))

