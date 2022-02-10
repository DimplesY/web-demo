// Number.isFinite 检查数值是否有限
console.log(Number.isFinite(16)); // true
console.log(Number.isFinite(NaN)); // false
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isFinite("12")); // false

// Number.isNaN 如果参数类型不是NaN，Number.isNaN一律返回false。
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN(1)); // false

// 将全局方法parseInt()和parseFloat()，移植到Number对象上面
console.log(Number.parseInt("1.1")); // 1
console.log(Number.parseFloat("12.2331&")); // 12.2331

// Number.isInteger 判断数字是否为整数
console.log(Number.isInteger("123.1")); // false
console.log(Number.isInteger("1")); // false
console.log(Number.isInteger(1)); // true

// 去掉浮点数的小数部分
console.log(Math.trunc("123.2")); // 123
console.log(Math.trunc(123.2)); // 123

// BigInt
let p = 1n;
for (let i = 1n; i <= 70n; i++) {
  p *= i;
}
console.log(p);
