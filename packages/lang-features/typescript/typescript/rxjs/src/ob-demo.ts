import { Observable, first, of } from 'rxjs'
;(() => {
  // let instance = new Observable(
  //   /** 订阅 */
  //   (s /** 订阅者 */) => {
  //     s.next(1)
  //     s.complete()
  //   }
  // )

  // instance.subscribe({
  //   next: (val) => {
  //     console.log(val)
  //   },

  //   complete: () => {
  //     console.log('你好 RxJS')
  //   },
  // })

  // let ins = new Observable((s) => {
  //   console.log('Hello')
  //   s.next(1)
  // })

  // ins.subscribe(console.log)
  // ins.subscribe(console.log)
  of(1,2,3).pipe(first()).subscribe(console.log)
})()
