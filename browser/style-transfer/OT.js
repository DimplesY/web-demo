// 转换函数
function transform(clientOp, serverOp) {
  if (clientOp.position < serverOp.position) {
    return clientOp
  } else if (clientOp.position > serverOp.position) {
    return {
      ...clientOp,
      position: clientOp.position + 1,
    }
  } else {
    // 当操作位置相同时，我们可以根据用户ID或操作的时间戳等信息对操作进行排序。
    // 在这个简化的示例中，我们仅比较操作中的字符。
    if (clientOp.character < serverOp.character) {
      return clientOp
    } else {
      return {
        ...clientOp,
        position: clientOp.position + 1,
      }
    }
  }
}

// 初始文档
let document = 'hello'

// 用户A和B的操作
const userAOperation = { type: 'insert', position: 1, character: 'a' }
const userBOperation = { type: 'insert', position: 1, character: 'b' }

// 使用转换函数处理用户A的操作
const transformedUserAOperation = transform(userAOperation, userBOperation)

// 应用操作到文档
document =
  document.slice(0, userBOperation.position) + userBOperation.character + document.slice(userBOperation.position)
document =
  document.slice(0, transformedUserAOperation.position) +
  transformedUserAOperation.character +
  document.slice(transformedUserAOperation.position)

console.log(document) // 输出 "habello"
