function chain(fns: Function[]) {
  let i = 0
  const next = async (...args: any) => {
    if (i >= fns.length) {
      return
    }
    const fn = fns[i].bind(null, next)
    i++
    await fn.apply(null, args)
  }

  return next
}

const dealWith = false

async function fn1(next) {
  if (dealWith) {
    console.log('我直接处理了')
  } else {
    next('给你传参数')
    console.log('我不处理了')
  }
}

function fn2(next, ...args) {
  console.log(args)
  next()
}

const start = chain([fn1, fn2])

start()

