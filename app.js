const Express = require("express");

const app = Express();

app.get("/", (req, res) => res.send("Hello, emily!"));

module.exports = app;
