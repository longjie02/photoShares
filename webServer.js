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
    nickName: userDB.nickName,
    description: userDB.description
  }
  if (isSelf) {
    userSend = {
      ...userSend,
      favorites: userDB.favorites,
      mentioned: userDB.mentioned,
      subs: userDB.subs
    }
  }
  return userSend;
}

//helper: derive Photo model from DB version
async function getPhotoListModel(photosDB, req) {
  let photoListSend = JSON.parse(JSON.stringify(photosDB));
  // find Photo creator's info
  await async.each(photoListSend, async (photo) => {
    photo["isLike"] = photo['likedBy'].includes(req.session);
    photo["countLike"] = photo['likedBy'].length;
    photo["photoId"] = photo._id;
    delete photo._id;
    delete photo.liked_by;
    delete photo.__v;
    let user = await User.findOne({ _id: photo.creatorId });
    photo.creator = getUserModel(user, false);
    delete photo.creatorId;
  });

  return photoListSend;
}
// middleware: login check
var loginCheck = (req, res, next) => {
  if (!req.session._id) {
    res.status(401).send('Please log in.');
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


app.get("/", function (req, res) {
  res.send("Simple web server of files from " + __dirname);
});

// API: auto login
app.get("/admin/current", function (req, res) {
  let _id = req.session._id;
  if (!_id) {
    console.log("This is a new connection!");
    res.status(200).send();
    return;
  }
  User.findOne({ _id: _id }, (_, user) => {
    if (!user) {
      console.log("id does not exist.");
      res.status(400).send("You have not registered.");
      return;
    }
    let userSend = getUserModel(user, true);
    res.status(200).send(JSON.stringify(userSend));
  });
});

// API: login
app.post('/admin/login', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.loginEmail });
    if (!user) {
      res.status(400).send('This account has not been created.');
      return;
    }
    if (user.password !== req.body.loginPassword) {
      res.status(400).send('your password not matches the email.');
      return;
    }
    req.session._id = user._id;
    let userSend = getUserModel(user, true);
    res.status(200).send(JSON.stringify(userSend));
  } catch (err) {
    console.log(err);
  }
});
/** API: process register request */
app.post('/admin/register', async (req, res) => {
  let {
    registerNickName,
    registerEmail,
    registerPassword
  } = req.body;
  /* nickname validation */
  if (registerNickName.length < 3) {
    res.status(400).send("The nickname should be at least 3 characters.");
    return;
  }

  /* password validation */
  if (registerPassword.length === 0) {
    res.status(400).send("Password cannot be empty.");
    return;
  }

  /* email validation */
  let emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (!emailPattern.test(registerEmail)) {
    res.status(400).send("The email address is invalid, please try again.");
    return;
  }

  try {
    let user = await User.findOne({ email: registerEmail });
    if (user) {
      res.status(400).send("This email address has existed.");
      return;
    }

    let newUser = await User.create({
      nickName: registerNickName,
      email: registerEmail,
      password: registerPassword
    });

    req.session._id = newUser._id;
    console.log("session: _id = " + req.session._id);

    res.status(200).send(JSON.stringify(newUser));

  } catch (err) {
    console.log(err);
    res.status(500).send("account cannot be created");
  }
});

// API: logout
app.post("/admin/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.status(400).send("sorry! unable to logout");
      return;
    }
    res.status(200).send();
  });
});

// API: save photo to /images/; update db
app.post("/photos/new", loginCheck, uploadHelper, async (req, res) => {
  try {
    let newPhoto = {
      fileName: req.file.filename,
      creatorId: req.session._id,
      description: req.body.description
    };
    await Photo.create(newPhoto);
    res.status(200).send("sucessful upload.");
  } catch (err) {
    console.log(err);
    res.status(500).send("upload failed.");
  }
})

// API: get user info 
app.get("/user/:_id", loginCheck, async (req, res) => {
  let _id = req.params._id;
  try {
    let user = await User.findOne({ _id: _id });
    let userSend = getUserModel(user, (req.session._id === _id ? true : false));
    if (req.session._id !== _id) {
      if (user.subs.includes(_id)) {
        userSend.isSubscribed = 2; // subscribed
      } else {
        userSend.isSubscribed = 1; // unsubscribed
      }
    } else {
      userSend.isSelf = true; // is your user info
    }
    res.status(200).send(JSON.stringify(userSend));
  } catch (err) {
    console.log(err);
    res.status(500).send("cannot get this user's info.");
  }
});

// API: get photoList of an user
app.get("/photoList/:_id", loginCheck, async (req, res) => {
  let _id = req.params._id;
  try {
    let photos = await Photo.find({ creatorId: _id });
    let photosSend = await getPhotoListModel(photos, req);
    res.status(200).send(JSON.stringify(photosSend));
  } catch (err) {
    console.log(err);
    res.status(500).send("cannot find photos of this user.");
  }
});

// API: add to favorites list
app.post('/addToFavorites', loginCheck, function (req, res) {
  let _id = req.session._id;
  let photoId = req.body.photoId;
  User.findOne({ _id: _id }, function (err, user) {
    if (err) {
      res.status(400).send("user id is invalid.");
      return;
    }
    if (!user.favorites.includes(photoId)) {
      user.favorites.push(photoId);
      user.save();
    }
    res.status(200).send();
  });
});

// API: get Favorites List
app.get('/getFavorites', loginCheck, async (req, res) => {
  let _id = req.session._id;
  try {
    let user = await User.findOne({ _id: _id });
    let favorites = user.favorites;
    let favoritesSend = [];
    await async.each(favorites, async (photoId) => {
      let photo = await Photo.findOne({ _id: photoId });
      favoritesSend.push({
        fileName: photo.fileName,
        dateTime: photo.dateTime,
        photoId: photo._id
      });
    })
    res.status(200).send(JSON.stringify(favoritesSend));
  } catch (err) {
    res.status(400).send('user id is invalid.');
  }
});

// API: delete favorite item
app.delete("/deleteFavorite/:photoId", loginCheck, async (req, res) => {
  let photoId = req.params.photoId;
  let _id = req.session._id;
  try {
    let user = await User.findOne({ _id: _id });
    let photoIdx = user.favorites.indexOf(photoId);
    user.favorites.splice(photoIdx, 1);
    user.save();
  } catch (err) {
    console.log(err);
    res.status(500).send("DB error, cannot delete photo");
  }

  res.status(200).send();
});

// API: toggleLikeOrUnlike
app.post('/toggleLike/:photoId', loginCheck, async (req, res) => {
  let photoId = req.params.photoId;
  let _id = req.session._id;
  Photo.findOne({ _id: photoId }, function (err, photo) {
    if (err) {
      res.status(400).send("invalid photo id.");
      return;
    }

    let userIdx = photo.likedBy.indexOf(_id);
    // only when user did effective actions, it's necessary to update db 
    if (req.body.like && userIdx < 0) {
      photo.likedBy.push(_id);
      photo.save();
    }
    if (!req.body.like && userIdx >= 0) {
      photo.likedBy.splice(userIdx, 1);
      photo.save();
    }
    res.status(200).send();
  });
});

// API: get subscribes list
// test: return all users as subscribes 
app.get('/subscribes', loginCheck, async (req, res) => {
  try {
    let users = await User.find({});
    let subsSend = [];
    users.forEach((user, idx) => {
      subsSend[idx] = getUserModel(user, false);
    })
    res.status(200).send(JSON.stringify(subsSend));
  } catch (err) {
    status.status(500).send();
  }
});

// API: get comments of a photo
app.get('/comments/:photoId', loginCheck, async (req, res) => {
  let photoId = req.params.photoId;
  try {
    let photo = await Photo.findOne({ _id: photoId });
    let commentsSend = JSON.parse(JSON.stringify(photo.comments));
    await async.each(commentsSend, async (comment) => {
      let user = await User.findOne({ _id: comment.creatorId });
      comment.nickName = user.nickName;
    });
    res.status(200).send(JSON.stringify(commentsSend));
  } catch (err) {
    console.log("get comments DB error.")
    res.status(500).send();
  }
});

// API: add comment to the photo + add mention to the mentioned person
app.post('/addComment/:photoId', loginCheck, async (req, res) => {
  let photoId = req.params.photoId;
  let _id = req.session._id;
  let text = req.body.newComment;
  let mentionsToAdd = req.body.mentionsToAdd || [];

  // add new comment text into the target photo
  try {
    let photo = await Photo.findOne({ _id: photoId });
    photo.comments.push({ text, creatorId: _id });
    photo.save();

    await async.each(mentionsToAdd, async (mention) => {
      let user = await User.findOne({ _id: mention });
      user.mentioned.push({
        photoId,
        text,
        nickName: user.nickName,
        fileName: photo.fileName
      });
      await user.save();
    });
    } catch (err) {
    console.log(err);
    res.status(500).send("adding new comment failed.");
  }

  res.status(200).send();
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