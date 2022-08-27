"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
(() => {
    (0, rxjs_1.from)([1, 2, 3])
        .pipe((0, rxjs_1.map)((x) => x * 100), (0, rxjs_1.scan)((acc, x) => acc + x, 0), (0, rxjs_1.skip)(2))
        .subscribe(console.log);
    // timer(0, 1000).subscribe((value) => console.log(value))
})();
