const app = require("../app");
const router = require("express").Router();
const { getBooks } = require("../controller/books");

router.get("/", getBooks);

app.use("/books", router);
