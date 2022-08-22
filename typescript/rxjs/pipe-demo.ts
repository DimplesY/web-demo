import { from, map, scan, skip, take, timer } from 'rxjs'
;(() => {
  from([1, 2, 3])
    .pipe(
      map((x) => x * 100),
      scan((acc, x) => acc + x, 0),
      skip(2)
    )
    .subscribe(console.log)

  // timer(0, 1000).subscribe((value) => console.log(value))
})()
