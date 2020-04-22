const Express = require("express");

const app = Express();

let emily = "hello Emily";

app.get("/", (req, res) => res.send("Hello, world!"));

module.exports = app;
