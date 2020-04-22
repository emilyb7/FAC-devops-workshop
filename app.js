const Express = require("express");

const app = Express();

const emily = "hello Emily";
const franny = "hello Emily";
const hello = "hello";

app.get("/", (req, res) => res.send("Hello, world!"));

module.exports = app;
