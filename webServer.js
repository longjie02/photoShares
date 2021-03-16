"use strict";

var fs = require("fs");
var bodyParser = require("body-parser");
var async = require("async");

var multer = require('multer');
const diskStorage = multer.diskStorage({
  destination: 'public/images/',
  filename: (req, file, cb) => {
    let fileFormat = file.originalname.split(".");
    cb(null, fileFormat[0].substring(0, 5) + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
var uploadHelper = multer({ storage: diskStorage }).single('photo');

var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
var User = require("./schema/user.js");
var Photo = require("./schema/photo");

const session = require("express-session");
var MongoStore = require('connect-mongo')(session);

var express = require("express");
var app = express();

/* helper function */
// helper: user model of send version
function getUserModel(userDB, isSelf) {
  let userSend = {
    _id: userDB._id,
    nickname: userDB.nickname,
    description: userDB.description
  }
  if (isSelf) {
    userSend = {
      ...userSend,
      favorites: userDB.favorites,
      metioned: userDB.metioned,
      followList: userDB.followList
    }
  }
  return userSend;
}

//helper: derive Photo model from DB version
async function getPhotoListModel(photosDB, request) {
  let photoListSend = JSON.parse(JSON.stringify(photosDB));
  // find Photo creator's info
  await async.each(photoListSend, async (photo) => {
    photo["is_like"] = photo['liked_by'].includes(request.session);
    photo["like_num"] = photo['liked_by'].length;
    delete photo.liked_by;
    delete photo.__v;
    let user = await User.findOne({ _id: photo.creator_id });
    photo.creator = getUserModel(user, false);
    delete photo.creator_id;
  });

  return photoListSend;
}
// middleware: login check
var loginCheck = (req, res, next) => {
  if (!req.session._id) {
    res.status(400).send('Please log in.');
    return;
  }
  next();
}

mongoose.connect("mongodb://localhost/cs142project", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static(__dirname + '/public'));
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
app.get("/admin/current", function (request, response) {
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
    let userSend = getUserModel(user, true);
    response.status(200).send(JSON.stringify(userSend));
  });
});

// API: login
app.post('/admin/login', async (request, response) => {
  try {
    let user = await User.findOne({ email: request.body.email });
    if (!user) {
      response.status(400).send('This account has not been created.');
      return;
    }
    if (user.password !== request.body.password) {
      response.status(400).send('your password not matches email address');
      return;
    }
    request.session._id = user._id;
    let userSend = getUserModel(user, true);
    response.status(200).send(JSON.stringify(userSend));
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
app.post("/admin/logout", (request, response) => {
  request.session.destroy(function (err) {
    if (err) {
      console.log(err);
      response.status(400).send("sorry! unable to logout");
      return;
    }
    response.status(200).send();
  });
});

// API: save photo to /images/; update db
app.post("/photos/new", loginCheck, uploadHelper, async (request, response) => {
  try {
    let newPhoto = {
      file_name: request.file.filename,
      creator_id: request.session._id,
      description: request.body.description
    };
    await Photo.create(newPhoto);
    response.status(200).send("sucessful upload.");
  } catch (e) {
    console.log(e);
    response.status(500).send("Unknown error.");
  }
})

// API: get user info (not your own info)
app.get("/user/:id", loginCheck, async (request, response) => {
  let id = request.params.id;
  try {
    let user = await User.findOne({ _id: id });
    let userSend = getUserModel(user, false);
    response.status(200).send(JSON.stringify(userSend));
  } catch (e) {
    console.log(e);
    response.status(500).send("Unknown error.");
  }
});

// API: get photoList of an user
app.get("/photoList/:id", loginCheck, async (request, response) => {
  let id = request.params.id;
  try {
    let photoList = await Photo.find({ creator_id: id });
    let photoListSend = await getPhotoListModel(photoList, request);
    response.status(200).send(JSON.stringify(photoListSend));
  } catch (e) {
    console.log(e);
    response.status(500).send("Unknown error.");
  }
});

// API: add to favorites list
app.post('/addToFavorites', loginCheck, function (request, response) {
  let user_id = request.session._id;
  let photo_id = request.body.photoId;
  User.findOne({ _id: user_id }, function (err, user) {
    if (err) {
      response.status(400).send("user id is invalid.");
      return;
    }
    if (!user.favorites.includes(photo_id)) {
      user.favorites.push(photo_id);
      user.save();
    }
    response.status(200).send();
  });
});

// API: get Favorites List
app.get(`/getFavorites`, loginCheck, async (request, response) => {
  let user_id = request.session._id;
  try {
    let user = await User.findOne({ _id: user_id });
    let favorites = user.favorites;
    let favoritesSend = [];
    await async.each(favorites, async (photo_id) => {
      let photo = await Photo.findOne({ _id: photo_id });
      favoritesSend.push({
        file_name: photo.file_name,
        date_time: photo.date_time,
        _id: photo._id
      });
    })
    console.log(favoritesSend);
    response.status(200).send(JSON.stringify(favoritesSend));
  } catch (e) {
    response.status(400).send('user id is invalid.');
  }
});

// API: delete favorite item
app.delete("/deleteFavorite/:photo_id", loginCheck, async (request, response) => {
  let photo_id = request.params.photo_id;
  let user_id = request.session._id;
  try {
    let user = await User.findOne({ _id: user_id });
    let photo_idx = user.favorites.indexOf(photo_id);
    user.favorites.splice(photo_idx, 1);
    user.save();
  } catch (e) {
    console.log(e);
    response.status(500).send("DB error, cannot delete photo");
  }

  response.status(200).send();
});

// API: toggleLikeOrUnlike
app.post(`/toggleLike/:photo_id`, loginCheck, async (request, response) => {
  let photo_id = request.params.photo_id;
  let user_id = request.session._id;
  Photo.findOne({ _id: photo_id }, function (err, photo) {
    if (err) {
      response.status(400).send("invalid photo id.");
      return;
    }

    let userIdx = photo.liked_by.indexOf(user_id);
    // only when user did effective actions, it's necessary to update db 
    if (request.body.like && userIdx < 0) {
      photo.liked_by.push(user_id);
      photo.save();
    }
    if (!request.body.like && userIdx >= 0) {
      photo.liked_by.splice(userIdx, 1);
      photo.save();
    }
    response.status(200).send();
  });
});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
    port +
    " exporting the directory " +
    __dirname
  );
});
