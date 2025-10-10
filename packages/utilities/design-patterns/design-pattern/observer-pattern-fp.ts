interface FP {
  (v: number): void;
}

interface FPObserver {
  on(fn:FP): void;
  off(fn:FP): void;
  emit(v:number): void;
}


function createObserver(): FPObserver {

  const callbacks:Array<FP> = [];

  function on(fn:FP){
    callbacks.push(fn);
  }

  function off(fn:FP){
    callbacks.splice(callbacks.indexOf(fn), 1);
  }

  function emit(val:number){
    callbacks.forEach(fn => fn(val));
  }

  return {
    on,
    off,
    emit
  }
}

const ob = createObserver()
ob.on((a) => {
  console.log(a)
})
ob.emit(1)

setTimeout(() => {
    ob.emit(2)
}, 1000);
