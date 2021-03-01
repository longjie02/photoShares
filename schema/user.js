"use strict";

var mongoose = require('mongoose');

// create a schema
var userSchema = new mongoose.Schema({
    // first_name: String, 
    // last_name: String,  
    // location: String,
    nickname: String,
    email: String,
    password: String,
     
    description: String,  
    // login_name: String,  
    // password: String,
    // occupation: String,    // Occupation of the user.
    mentioned: [mongoose.Schema.Types.ObjectId], //array of photo ids 
    favorites: [mongoose.Schema.Types.ObjectId], //array of photo ids
});

var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
