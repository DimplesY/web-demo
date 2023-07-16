
function myInstanceof(left, right) {
  // 如果不是对象直接返回 false
  if(typeof left !== 'object' || left === null) return false

  const proto = Object.getPrototypeOf(left)
  while(true){
    if(right === null) return false
    if(proto === right.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
}
