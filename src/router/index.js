const express = require("express");

const app = require("../app/index");
const { getImge, getImgeDetails, searchImge } = require("../controller");

const route = express.Router();

route.get("/", getImge);

route.get("/search", searchImge);

route.get("/details", getImgeDetails);

app.use("/", route);
