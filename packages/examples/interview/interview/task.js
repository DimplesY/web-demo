
function HardMan(name) {
  const tasks = []
  let after = 0

  function fn(name) {
    tasks.push({
      type: 'log',
      value: "i'm " + name,
    })
  }

  fn.prototype.reset = function (time) {
    tasks.push({
      type: 'sleep',
      value: time,
    })

    return this
  }

  fn.prototype.resetFirst = function (time) {
    tasks.unshift({
      type: 'sleep',
      value: time,
    })

    return this
  }

  fn.prototype.learn = function (name) {
    tasks.push({
      type: 'log',
      value: 'learning ' + name,
    })
    return this
  }

  function sleep(time) {
    return new Promise((rs) => {
      setTimeout(() => {
        rs()
      }, time)
    })
  }
  

  async function next() {
    const item = tasks.shift()
    if (!item) return
    if (item.type === 'log') {
      console.log(item.value)
    } else if (item.type === 'sleep') {
      await sleep(item.value)
      after += item.value
      console.log('start learning after ' + after + ' ms')
    }
    next()
  }

  setTimeout(() => {
    next()
  })

  return new fn(name)
}


// HardMan('lilei').reset(100).learn('chinese')


HardMan('lilei').resetFirst(100).learn('chinese')
