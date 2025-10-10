// 手撕算法(就是一个函数，两个参数，第一个是对象{a:{b:1}}，第二个是字符串"a.b.c"，通过字符串拿到目标值，注意有数组形式，数组形式比较麻烦类似于{a: {b: {c: [1, 2, 3]}}}，"a.b.c[2]")

function get(obj, path) {
  const pathList = path.replace(/\[/g, '.').replace(/\]/g, '').split('.')
  let result = obj[pathList.shift()]
  while (pathList.length > 0) {
    result = result[pathList.shift()]
  }
  return result
}

console.log(get({ a: { b: 1 } }, 'a.b'))
console.log(
  get(
    {
      a: {
        b: {
          c: [1, 2, 3],
        },
      },
    },
    'a.b.c[0]'
  )
)
