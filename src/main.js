const path = require('path');

const app = require('./app/index');
const {
  APP_PORT,
  APP_HOST
} = require("./app/config");

require('./router');
require('./router/setu.router')


app.set('views', path.join(__dirname,'views'));
app.set("view engine","ejs");



app.listen(APP_PORT, APP_HOST, (err) => console.log(`Example app listening on port ${APP_PORT}!`));