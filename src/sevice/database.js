const mysql = require("mysql2");
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
} = require("../app/config");

const connections = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
});
// 验证数据是否连接成功
connections.getConnection((err) => {
  if (err) {
    console.log("数据库连接失败：", err);
  } else {
    console.log("数据库连接成功~");
  }
});

// 用promise的方式使用mysql
module.exports = connections.promise();
