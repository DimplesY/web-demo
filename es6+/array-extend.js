/**
 * 数组的扩展
 */

// 扩展运算符
console.log(...[1, 2, 3, 4]); // 1 2 3 4

console.log(1, ...[1, 2, 3, 4]); // 1 1 2 3 4

// 只有函数声明扩展运算符才能放到圆括号里
function push(array, ...items) {
  array.push(...items);
}

function add(x, y) {
  return x + y;
}
const numbers = [4, 38];
add(...numbers); // 42

// const arr = [...(x > 0 ? ["a"] : []), "b"];

Math.max(...[14, 3, 77]);
Math.max.apply(null, [14, 3, 77]);

function* go() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
}
console.log(...go()); // 1 2 3 4

/**
 * Array.from()
 */
let arrayLike = {
  0: "a",
  1: "b",
  2: "c",
  length: 3,
};
var arr1 = [].slice.call(arrayLike); // ['a','b','c']
let arr2 = Array.from(arrayLike); // ['a','b','c']

Array.from(arrayLike, console.log);

/**
 * Array.of()
 */
console.log(Array.of(3, 11, 8)); // [3,11,8]

/**
 * copyWithin()
 */
console.log([1, 2, 3, 4, 5].copyWithin(0, 3, 4));

/**
 * find()
 */
console.log([1, 2, 3, 4].find((item) => item > 2)); // 3

/**
 * findIndex()
 */
console.log([1, 2, 3, 4, 5, 6].findIndex((item) => item == 6)); // 5

/**
 * fill() 注意对象是浅拷贝
 */
console.log(["a", "b", "v"].fill(0)); // [0,0,0]
console.log(["a", "b", "v"].fill({ name: "Mark" })); // [{name:"Mark"},{name:"Mark"},{name:"Mark"}]

/**
 * keys():键
 * values()：值
 * entries()：键值对
 */
for (let index of ["a", "b"].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ["a", "b"].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ["a", "b"].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"

/**
 * flat()
 */
console.log([1, 2, [3, [4, 5]]].flat());
// [1, 2, 3, [4, 5]]

console.log([(1, 2, [3, [4, 5]])].flat(2));
// [1, 2, 3, 4, 5]

console.log([1, [2, [3]]].flat(Infinity)); // [1,2,3]

/**
 * flatMap()
 */
// 相当于 [[2, 4], [3, 6], [4, 8]].flat()
console.log([1, 2, 3, 4, 5].flatMap((x) => [x, x * 2]));

const arr2 = [5, 12, 8, 130, 44];
console.log(arr2.at(3)); // 130
console.log(arr2.at(-1)); // 130
