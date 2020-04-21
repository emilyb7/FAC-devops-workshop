const Express = require("express");

const app = Express();

app.get("/", (req, res) => res.send("Hello, world!"));

module.exports = app;