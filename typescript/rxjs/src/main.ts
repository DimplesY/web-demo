import { concatAll, fromEvent, interval, map, scan, take, throttleTime } from 'rxjs'
import testBus from './bus/custom-bus'

fromEvent(document.querySelector('#btn')!, 'click')
  .pipe(
    // throttleTime(1000),
    // map((event) => (event as MouseEvent).clientX),
    map(() => interval(1000).pipe(take(4))),
    concatAll()
    // scan((acc) => acc + 1, 0)
  )
  .subscribe((x) => {
    // testBus.emit('test', x)
    console.log(x)
  })

testBus.on('test', (data) => {
  console.log(data)
})
1
