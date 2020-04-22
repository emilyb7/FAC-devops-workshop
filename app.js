const Express = require("express");

//margin to master 
const app = Express();

app.get("/", (req, res) => res.send("Hello, world!"));

module.exports = app;
