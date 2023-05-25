import { fromEvent, map, scan, throttleTime } from "rxjs";
import testBus from "./bus/custom-bus";


fromEvent(document.querySelector("#btn")!, 'click')
  .pipe(
    throttleTime(1000),
    map((event) => (event as MouseEvent).clientX),
    scan((acc, x) => acc + x, 0),
  )
  .subscribe(x => {
    testBus.emit('test', x)
  })


testBus.on('test', (data) => {
  console.log(data)
})
