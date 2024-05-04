const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

const code = `
const a = 10;
function sum(a, b) {
  return a + b
}
`

const ast = parser.parse(code)
traverse(ast, {
  NumberLiteral(path) {
    if (path.isNumericLiteral({ value: 10 }) && path.parent.type === 'VariableDeclarator') { 
      path.node.value = 1000
    }
  },
  Identifier(path) {
    if (path.isIdentifier({ name: 'a' }) && path.parent.type === 'VariableDeclarator') {
      path.node.name = 'x'
    }
    if (path.isIdentifier({ name: 'sum' })) {
      path.node.name = 'add'
    }
  },
})

const result = generator(ast, {}, code)
console.log(result.code)
