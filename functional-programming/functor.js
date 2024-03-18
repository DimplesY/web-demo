import { prop, add, compose } from 'ramda'
const Container = function (x) {
  this.__value = x
}
Container.of = function (x) {
  return new Container(x)
}
Container.prototype.map = function (f) {
  return new Container(f(this.__value))
}


const MayBe = function(x) {
  this.__value = x
}

MayBe.of = function(x) {
  return new MayBe(x)
}

MayBe.prototype.isNothing = function() {
  return this.__value === null || this.__value === undefined
}

MayBe.prototype.map = function(f) {
  return this.isNothing() ? MayBe.of(null) : MayBe.of(f(this.__value))
}


console.log(MayBe.of({age:20}).map(prop('age')).map(add(10)))

const change = compose(add(10), prop('age'))
console.log(MayBe.of({age:20}).map(change))
