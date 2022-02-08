// ES6 中局部作用域
{
  let a = 10;
  var b = 1;
}
// console.log(a); // ReferenceError
console.log(b);

let funcArray = [];
/**
 * for 循环中更加适合使用 let，
 * 并且函数内部定义的 i 与循环内的 i 的作用域也相互独立
 **/
for (let i = 0; i < 10; i++) {
  funcArray[i] = function () {
    console.log(i);
  };
}
funcArray[6](); // 6

// TDZ 暂时性死区
function testTDZ() {
  temp = "abc"; // ReferenceError
  console.log(temp); // ReferenceError
  let temp;
}
// testTDZ();

function bar(x = y, y = 2) {
  // x 等于 y y 还没有申明初始化
  return [x, y];
}

// bar() ReferenceError

// 使用块级作用域代替 IIFE
// IIFE 写法
(function () {
  console.log("AAA");
})();

// 块级作用域写法
{
  console.log("AAA");
}
