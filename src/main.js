const path = require("path");

const app = require("./app/index");
const { APP_PORT, APP_HOST } = require("./app/config");

require("./router");
require("./router/setu.router");
require("./router/upload.router");
require("./router/books.router");

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

app.listen(APP_PORT, () =>
  console.log(`Example app listening on port http:${APP_HOST}:${APP_PORT}`)
);
