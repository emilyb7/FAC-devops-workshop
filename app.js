const Express = require("express");

const app = Express();

app.get("/", (req, res) => res.send("Hello, worlds!"));

module.exports = app;
