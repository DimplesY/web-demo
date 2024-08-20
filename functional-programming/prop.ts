import { compose, curry, get, pick } from 'lodash/fp'

const responseData = {
  name: 'John',
  age: 30,
  habit: [
    {
      name: 'pushups',
      count: 10,
    },
  ],
}

const prop = curry((key, obj) => obj[key])

const map = curry((fn, arr) => arr.map(fn))

const tace = curry((tag, a) => {
  console.log(tag, a)
  return a
})

const log = (x) => {
  console.log(x)
  return x
}

const name = compose(map(log), prop('habit'))


const data = compose(pick(['name', 'age']))

console.log(data(responseData))
