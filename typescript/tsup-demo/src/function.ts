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
