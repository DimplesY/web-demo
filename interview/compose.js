function compose(...args){
  return function(x){
    return args.reduceRight((acc, fn) => fn(acc), x)
  }
}
