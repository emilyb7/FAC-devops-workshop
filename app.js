const Express = require("express");

const app = Express();

app.get("/", (req, res) => res.send("Hello, sohil!"));

module.exports = app;