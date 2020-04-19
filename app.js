const Express = require("express");

const app = Express();

app.get("/", (req, res) => res.sendStatus(200));

module.exports = app;
