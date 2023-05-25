import { Subject } from 'rxjs'
const subject = new Subject()
subject.next(0)
// 没有订阅之前也可以发布,但是订阅收不到消息
subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
})
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
})
subject.next(1)
subject.next(2)
