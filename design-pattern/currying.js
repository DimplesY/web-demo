/**
 * 函数柯里化
 */
function currying(fn) {
  let args = []
  return function () {
    if (arguments.length === 0) {
      return fn.apply(this, args)
    } else {
      ;[].push.apply(args, arguments)
      return arguments.callee
    }
  }
}

function curry(fn) {
  const arglen = fn.length
  return function fn1(...args1) {
    if (args1.length >= arglen) {
      return fn.apply(fn, args1)
    } else {
      const fn2 = function (...args2) {
        return fn1.apply(fn, args1.concat(args2))
      }
      return fn2
    }
  }
}

var cost = (function () {
  var money = 0
  return function () {
    for (var i = 0, l = arguments.length; i < l; i++) {
      money += arguments[i]
    }
    return money
  }
})()
