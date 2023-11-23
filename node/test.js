// 导入模块
const mysql = require('mysql2');

// 创建一个数据库连接
  const connection = mysql.createConnection({
    host: '10.0.0.116',
    port: '3306',
    user: 'root',
    database: 'allin_cloud',
    password: 'Allin@019'
  });
  
  connection.promise().query(
    'SHOW CREATE TABLE org_sync'
  ).then(([rows, fields])  => {
    console.log(rows)
    const table =rows[0]
    console.log(fields)
  })

