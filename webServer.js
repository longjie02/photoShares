"use strict";

var bodyParser = require("body-parser");

var express = require("express");
var app = express();

app.use(express.static(__dirname + '/compiled'));
app.use(bodyParser.json());

app.get("/", function(request, response) {
    response.send("Simple web server of files from " + __dirname);
});

var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log(
      "Listening at http://localhost:" +
        port +
        " exporting the directory " +
        __dirname
    );
  });
