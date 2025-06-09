import r from 'ramda'


const getAge = r.prop('age')

const user = {
  age: 10000
}

console.log(getAge(user))
