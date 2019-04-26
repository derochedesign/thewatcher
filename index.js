const express = require('express');
const controller = require("./controller");
const port = 3042;

const app = express();

app.set("view engine", "ejs");

app.use(express.static("./public"));

controller(app);

app.use(function(req, res) {
   res.render("404");
});

app.use(function(error, req, res, next) {
   res.render("500");
});

app.listen(process.env.PORT || port, "10.9.192.94");
console.log(`listening on ${port}`);
