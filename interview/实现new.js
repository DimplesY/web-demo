function Person(name) {
  this.name = name
}

Person.prototype.getName = function () {
  return this.name
}

// 编写一个函数实现 new
var objFactory = function () {
  let obj = new Object()
  let Constructor = [].shift.call(arguments)
  obj.__proto__ = Constructor.prototype
  var ret = Constructor.apply(obj, arguments)
  return typeof ret == 'object' ? ret : obj
}

let a = new Person('jack')
console.log(a)
console.log(objFactory(Person, 'jack'))
