function sum(a: number, b: number): number {
  return a + b
}

export default sum

function debounce(fn: Function, wait: number) {
  let timer: number
  return function(){
    let args = arguments
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait);
  }
}

function throttle1(fn:Function,wait:number){
  let time: number
  return function(){
    let args = arguments
    let now = Date.now()
    if(now - time > wait) {
      fn.apply(this, args)
    }
    time = now
  }
}

function throttle2(fn:Function, wait:number){
  let timer:number | null
  return function(){
    let args = arguments
    if(!timer){
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, wait)
    }
  }
}


function deepClone(obj: any, hash: WeakMap<any, any> = new WeakMap()) {
  if (obj === null) return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  // 普通对象
  if (typeof obj !== 'object') return obj
  // 如果对象已经被克隆过，直接返回
  if (hash.has(obj)) return hash.get(obj)
  // 创建新对象
  let cloneObj = new obj.constructor();
  // 缓存克隆过的对象
  hash.set(obj, cloneObj)
  
  for(let key in obj){
    if(obj.hasOwnProperty(key)){
      cloneObj[key] = deepClone(obj[key], hash)
    }
  }
  return cloneObj
}