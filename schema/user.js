"use strict";

var mongoose = require('mongoose');

// create a schema
var userSchema = new mongoose.Schema({
    // first_name: String, 
    // last_name: String,  
    // location: String,
    nickName: String,
    email: String,
    password: String,

    description: String,
    // login_name: String,  
    // password: String,
    // occupation: String,    // Occupation of the user.
    mentioned: [{
        photoId: mongoose.Schema.Types.ObjectId,
        dateTime: {type: Date, default: Date.now},
        nickName: String,
        text: String,
        fileName: String
    }], //array of photo ids 
    favorites: [mongoose.Schema.Types.ObjectId], //array of photo ids
    subs: [mongoose.Schema.Types.ObjectId] // array of user ids
});

var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
