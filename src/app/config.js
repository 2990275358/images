const { resolve } = require("path");

const dotenv = require("dotenv");

console.log(resolve(__dirname, "../../.env"));
dotenv.config({ path: resolve(__dirname, "../../.env") });

module.exports = {
  APP_PORT,
  APP_HOST,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  LOADING_IMG,
} = process.env;
