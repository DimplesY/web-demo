// 函数增加默认值
function log(x, y = 10) {
  console.log(x, y);
}
log(10); // 10 10
console.log(log.length); // 2 返回函数的参数个数减去指定了默认值的参数个数

// 和解构赋值结合使用
function func1({ x, y = 6 } = {}) {
  console.log(x, y);
}
func1(); // undefined 6s
