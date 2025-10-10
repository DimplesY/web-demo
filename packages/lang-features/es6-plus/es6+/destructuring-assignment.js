/**
 * 数组解构赋值
 */

let [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3

let [x, ...y] = [1, 2, 3, 4, 5];
console.log(x, y); // 1 [2,3,4,5]

/**
 * Set 也可以使用数组的解构赋值
 * 具有 Iterator 接口的数据结构都可以采用解构赋值
 */
let [x1, y1, z1] = new Set(["a", "b", "c"]);
console.log(x1, y1, z1); // a b c

function* fibs() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}
let [first, second, third, fourth, fifth, sixth] = fibs();
console.log(sixth); // 5

// 对象的解构赋值
let { foo, bar, baz } = { foo: "aaa", bar: "bbb" };
console.log(foo); // aaa
console.log(bar); // bbb
console.log(baz); // undefined

// 变量名和属性名不一致
let { foo: bax } = { foo: "aaa", bar: "bbb" };
console.log(bax); // aaa

// 按下标解构数组
let arr = [1, 2, 3, 4];
let { 0: start, [arr.length - 1]: last } = arr;
console.log(start, last);

// 字符串解构
const [str1, str2, str3] = "yan";
console.log(str1, str2, str3);
const { length: len } = "dimples";
console.log(len);

// 函数的参数解构赋值
let result = [
  [1, 2],
  [3, 4],
  [5, 6],
].map(([a = 0, b = 0]) => a + b);
console.log(result);
