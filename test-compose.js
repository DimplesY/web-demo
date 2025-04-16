function compose(...funcs) {
  return () => funcs.reduceRight((next, fn) => fn(next), () => {})()
}


function f(next) {
  console.log(1)
  next()
  console.log(2)
}

function g(next) {
  console.log(3)
  next()
  console.log(4)
}

function d(next) {
  console.log(5)
  next()
  console.log(6)
}

compose(f, g, d)()
