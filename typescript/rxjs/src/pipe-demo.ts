import { from, map, scan, skip, take, timer } from 'rxjs'
from([1, 2, 3])
.pipe(
  map((x) => x * 100),
  scan((acc, x) => acc + x, 0),
  // skip(2)
  // take(3)
)
.subscribe(console.log)
