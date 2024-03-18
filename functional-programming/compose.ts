// import { compose } from 'lodash/fp'

namespace TestCompose {
  function compose(...args: Function[]) {
    return function(x){
      return args.reduceRight((acc, fn) => fn(acc), x)
    }
  }
  
  const double =  (x: number) => 2 * x
  
  const increment = (x: number) => x + 1
  
  const result = compose(double, increment)
  console.log(result(10))
}

