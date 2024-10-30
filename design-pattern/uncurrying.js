
Function.prototype.unCurrying = function () {
  const self = this
  return function () {
    let obj = Array.prototype.shift.call(arguments)
    return self.apply(obj, arguments)
  }
}

Function.prototype.unCurrying = function () {
  const self = this
  return Function.prototype.call.apply(self, arguments)
}
