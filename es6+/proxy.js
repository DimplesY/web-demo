const user = {
  name: 'John',
}

// 在访问的时候进行代理，target 代表被代理的对象，key 代表被访问的属性，receiver 代表代理对象
let getter = (target, key, receiver) => {
  // Reflect.get(target, key, receiver) 与 target[key] 等价, receiver 可以保证 this 指向代理对象
  return Reflect.get(target, key, receiver)
}

// 当对象在设置值当时候进行代理，target 代表被代理的对象，key 代表被访问的属性，value 代表设置的值，receiver 代表代理对象
let setter = (target, key, value, receiver) => {
  console.log("我被修改了")
  return Reflect.set(target, key, value, receiver)
}

let ownKeys = (target) => {
  return Reflect.ownKeys(target)
}


const userProxy = new Proxy(user, {
  get: getter,
  set: setter,
  ownKeys,
})


console.log(userProxy.name) // John

userProxy.name = 'Tom'

for(let i in userProxy) {
  console.log(i)
}