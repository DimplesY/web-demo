let obj = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  length: 4,
  [Symbol.iterator]() {
    let index = 0

    return {
      next: () => {
        return { value: this[index], done: this.length === index++ }
      },
    }
  },

  // 可以用生成器函数实现迭代器
  // [Symbol.iterator]: function* () {
  //   for (let i in this) {
  //     yield this[i]
  //   }
  // },
}

let arr = [...obj]
console.log(arr)

function co(it) {
  return new Promise((resolve, reject) => {
    function step(data) {
      let { value, done } = it.next(data)
      !done && Promise.resolve(value).then(step).catch(reject)
      done && resolve(value)
    }
    step()
  })
}
