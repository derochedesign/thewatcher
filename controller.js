var bodyParser = require("body-parser");
var fs = require('fs');

var urlencode = bodyParser.urlencoded({extended: false});

module.exports = function(app) {

  app.get("/", function(req, res) {
    res.render("index", {project:"home"});
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

  // app.get("/:project", function(req, res) {
  //   res.render("index", {project:req.params.project});
  // });
  


};
