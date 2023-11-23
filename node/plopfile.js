const { readFileSync } = require('fs')
const { camelCase, upperFirst } = require('lodash')
const { Parser } = require('sql-ddl-to-json-schema')

const parser = new Parser('mysql')

module.exports = function (plop) {
  plop.setGenerator('api', {
    description: '生成API模版',
    prompts: [
      {
        type: 'input',
        name: 'sql',
        message: '请输入SQL文件位置',
      },
    ],
    actions: (options) => {
      const actions = []

      const sql = readFileSync(options.sql, { encoding: 'utf-8' })
      const json = parser.feed(sql).toCompactJson(parser.results)
      const table = json.at(0)
      const data = {
        name: upperFirst(camelCase(table.name)),
        columns: table.columns.map((i) => ({ name: camelCase(i.name), type: transformDataType(i.type.datatype) })),
      }

      actions.push({
        type: 'add',
        path: 'src/api/interface.ts',
        templateFile: 'template-gen/template/api/interface.hbs',
        data,
      })

      return actions
    },
  })
}


function transformDataType(type) {
  
  const typeMap = {
    int: 'number',
    varchar: 'string',
    text: 'string',
    datetime: 'string'
  }

  return typeMap[type]
}
