/**
 * 模板字符串
 */

function test([x]) {
  console.log(`这个数字是：${x}`);
}

test`1`;

let a = 5;
let b = 10;

function tag(stringArr, value1, value2) {
  console.log(stringArr);
  console.log(value1);
  console.log(value2);
}

tag`Hello ${a + b} world ${a * b}`;
// 等同于
tag(["Hello ", " world ", ""], 15, 50);

// 过滤用户输入的内容，防止恶意代码
function SaferHTML(templateData) {
  let s = templateData[0];
  for (let i = 1; i < arguments.length; i++) {
    let arg = String(arguments[i]);

    // Escape special characters in the substitution.
    s += arg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}
let sender = '<script>alert("你好")</script>';
let msg = SaferHTML`<p>${sender}</p>`;
console.log(msg);
