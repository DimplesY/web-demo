class Char {
  constructor(value, position, author) {
    this.value = value;
    this.position = position;
    this.author = author;
  }
}

// 应用操作函数
function applyOperation(document, operation) {
  const index = document.findIndex((char) => char.position >= operation.char.position);
  document.splice(index, 0, operation.char);
}

// 初始文档
let document = "hello".split("").map((char, index) => new Char(char, index, "initial"));

// 用户A和B的操作
const userAOperation = { type: "insert", char: new Char("a", 0.1, "userA") };
const userBOperation = { type: "insert", char: new Char("b", 0.2, "userB") };

// 应用操作到文档
applyOperation(document, userBOperation);
applyOperation(document, userAOperation);

// 转换文档回字符串并输出
const result = document.map((char) => char.value).join("");
console.log(result); // 输出 "habello"
