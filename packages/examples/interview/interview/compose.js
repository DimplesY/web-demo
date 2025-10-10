function compose(...args){
  return function(x){
    return args.reduceRight((acc, fn) => fn(acc), x)
  }
}

function pipe(...args){
  return function(x){
    return args.reduce((acc, fn) => fn(acc), x)
  }
}


console.log(pipe((x) => x + 1, (x) => x + 2, (x) => x + 3)(0))



// 输出 1 3 5 6 4 2
function compose(...fns) {
 
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

function h(next) {
  console.log(5)
  next()
  console.log(6)
}


compose(f, g, h)()
