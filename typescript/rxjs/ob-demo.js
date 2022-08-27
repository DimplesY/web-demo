"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
(() => {
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
    let ins = new rxjs_1.Observable((s) => {
        console.log('Hello');
        s.next(1);
    });
    ins.subscribe(console.log);
    ins.subscribe(console.log);
})();
