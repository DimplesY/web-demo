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
