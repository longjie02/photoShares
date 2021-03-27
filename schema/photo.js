"use strict";

var commentSchema = require("./comment");

var mongoose = require('mongoose');

/*
 * Photo can have comments and we stored them in the Photo object itself using
 * this Schema:
 */


var tagSchema = new mongoose.Schema({
    x: Number, //percent
    y: Number, //percent of the image
    width: Number, //percent of the image
    height: Number, //percent of the image
    user_id: mongoose.Schema.Types.ObjectId, //the person being tagged. 
    full_name: String,
})

// create a schema for Photo
var photoSchema = new mongoose.Schema({
    fileName: String, // 	Name of a file containing the actual photo (in the directory project6/images).
    creatorId: mongoose.Schema.Types.ObjectId, // The ID of the user who created the photo.
    dateTime: {type: Date, default: Date.now}, // 	The date and time when the photo was added to the database
    description: String,
    comments: [commentSchema], // Array of comment objects representing the comments made on this photo.
    likedBy: [mongoose.Schema.Types.ObjectId],
    // usersPermitted: [mongoose.Schema.Types.ObjectId]
});

var Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
