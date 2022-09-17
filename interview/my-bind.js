// 手写 bind
Function.prototype.myBind =
  (context, ...args) =>
  (...args2) =>
    this.apply(context, args.concat(args2))

// 手写 apply
Function.prototype.myApply = (context, args) => {
  context.temp = this
  let result = context.temp(...args)
  delete context.temp
  return result
}

// 手写 call
Function.prototype.myCall = (context, ...args) => {
  context.temp = this
  let result = context.temp(...args)
  delete context.temp
  return result
}