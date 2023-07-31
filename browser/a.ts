export const pipe: any =
  (...fns: Promise<Function>[]) =>
  (input: any) =>
    fns.reduce((chain: Promise<Function>, func: Function | Promise<Function> | any) => chain.then(func), Promise.resolve(input));

export const compose: any =
  (...fns: Promise<Function>[]) =>
    (input: any) =>
      fns.reduceRight((chain: Promise<Function>, func: Function | Promise<Function> | any) => chain.then(func), Promise.resolve(input));



const result = pipe(
  (x: number) => x + 1,
  (x: number) => x + 2,
  (x: number) => x + 3,
)(1)


result.then((x: number) => console.log(x)) 


const result2 = compose(
  (x: number) => x + 1,
  (x: number) => x + 2,
  (x: number) => x + 3,
)(1)

result2.then((x: number) => console.log(x))
