import vm from 'node:vm'
import * as lodash from 'lodash-es'

const context = {
  result: null,
  lodash: lodash
}

vm.createContext(context)

const code = `function main() { result = { x: lodash.add(10, 10) } }; main()`


vm.runInContext(code, context)

console.log(context.result)
