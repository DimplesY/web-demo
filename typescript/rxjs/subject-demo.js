"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
(() => {
    const subject = new rxjs_1.Subject();
    subject.next(0);
    // 没有订阅之前也可以发布,但是订阅收不到消息
    subject.subscribe({
        next: (v) => console.log(`observerA: ${v}`),
    });
    subject.subscribe({
        next: (v) => console.log(`observerB: ${v}`),
    });
    subject.next(1);
    subject.next(2);
})();
