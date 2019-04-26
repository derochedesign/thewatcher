var bodyParser = require("body-parser");
var fs = require('fs');

var urlencode = bodyParser.urlencoded({extended: true});

module.exports = function(app) {

  // app.get("/", function(req, res, next) {
  //   req.url = '/ing';
  //   next();
  // });
  
  app.get("/", function(req, res) {
    res.render("index");
  });
  
  app.get("/city", function(req, res) {
    res.render("city");
  });
  app.get("/popups", function(req, res) {
    res.render("popups");
  });
  app.get("/pov", function(req, res) {
    res.render("povvideos");
  });
  
  app.post("/update", urlencode, function(req, res) {

    var writeJson = JSON.stringify(req.body);
    fs.writeFileSync('./public/data/updates.json', writeJson, 'utf8');
  });
};
