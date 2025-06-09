import { parseArgs } from 'node:util'

const args = ['-f']
const options = {
  foo: {
    type: "boolean",
    short: 'f'
  }
}

const {values, positionals} = parseArgs({ args, options })

console.log(values, positionals)
