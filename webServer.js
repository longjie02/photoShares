"use strict";

var fs = require("fs");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");




var User = require("./schema/user.js");

var express = require("express");
var app = express();

mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/cs142project", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static(__dirname + '/compiled'));
app.use(bodyParser.json());

app.get("/", function(request, response) {
    response.send("Simple web server of files from " + __dirname);
});


/** function: process register request */
app.post('/admin/register', async (request, response) => {
  let {
      nickname,
      email,
      password
  } = request.body;
  /* nickname validation */
  if (nickname.length < 3) {
      response.status(400).send("The nickname should be at least 3 characters.");
      return;
  }

  /* password validation */
  if (password.length === 0) {
      response.status(400).send("Password cannot be empty.");
      return;
  }

  /* email validation */
  let email_pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (!email_pattern.test(email)) {
      response.status(400).send("The email address is invalid, please try again.");
      return;
  }

  try {
      let user = await User.findOne({ email });
      if (user) {
        response.status(400).send("This email address has existed.");
          return;
      }

      let newUser = await User.create({
          nickname,
          email,
          password
      });

      // ctx.session.nickname = newUser.nickname;
      // ctx.session.user_id = newUser._id;
      // let current_user = {
      //     _id: newUser._id,
      //     nickname: newUser.nickname
      // }
      response.status(200).send(JSON.stringify(newUser));
    
  } catch (err) {
      console.log(err);
      response.status(500).send("account cannot be created");
  }
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
