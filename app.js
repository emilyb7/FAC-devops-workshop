const Express = require("express");

const unused = "emptystring";

//margin to master
const app = Express();

app.get("/", (req, res) => res.send("Hello, world!"));

module.exports = app;
