"use strict";

var fs = require("fs");
var bodyParser = require("body-parser");

var multer = require('multer');
const diskStorage = multer.diskStorage({
  destination: 'images/',
  filename: (req, file, cb) => {
    let fileFormat = file.originalname.split(".");
    cb(null, fileFormat[0].substring(0,5) + Date.now() + "." + fileFormat[fileFormat.length-1]);
  }
})
var uploadHelper = multer({storage: diskStorage}).single('photo');

var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
var User = require("./schema/user.js");

const session = require("express-session");
var MongoStore = require('connect-mongo')(session);

var express = require("express");
var app = express();

// middleware: login check
var loginCheck = (req, res, next) => {
  if (!req.session._id) {
    res.status(400).send('Please log in.');
    return;
  }
  console.log("login check is valid.");
  next();
}

mongoose.connect("mongodb://localhost/cs142project", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static(__dirname + '/compiled'));
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    _id: undefined,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(bodyParser.json());


app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

// API: auto login
app.get("/admin/current", function(request, response) {
  let _id = request.session._id;
  if (!_id) {
    console.log("This is a new connection!");
    response.status(200).send(undefined);
    return;
  }
  User.findOne({ _id: _id }, (_, user) => {
    if (!user) {
      console.log("id not exists.");
      response.status(400).send("You have not registered.");
      return;
    }

    response.status(200).send(JSON.stringify(user));
  });
});

// API: login
app.post('/admin/login', async (request, response) => {
  try {
    let user = await User.findOne({email: request.body.email});
    if (!user) {
      response.status(400).send('This account has not been created.');
      return;
    }
    if (user.password !== request.body.password) {
      response.status(400).send('your password not matches email address');
      return;
    }
    request.session._id = user._id;
    response.status(200).send(JSON.stringify(user));
  } catch (err) {
    console.log(err);
  }
});
/** API: process register request */
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

    request.session._id = newUser._id;
    console.log("session: _id = " + request.session._id);

    response.status(200).send(JSON.stringify(newUser));

  } catch (err) {
    console.log(err);
    response.status(500).send("account cannot be created");
  }
});

// API: logout
app.post("/admin/logout", function(request, response) {
  request.session.destroy(function(err) {
    if (err) {
      console.log(err);
      response.status(400).send("sorry! unable to logout");
      return;
    }
    response.status(200).send();
  });
});

app.post("/photos/new", loginCheck, uploadHelper, (request, response) => {
  response.status(200).send();
})

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
    port +
    " exporting the directory " +
    __dirname
  );
});
