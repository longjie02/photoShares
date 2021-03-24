"use strict";
var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: String,     // The text of the comment.
    dateTime: {type: Date, default: Date.now}, // The date and time when the comment was created.
    creatorId: mongoose.Schema.Types.ObjectId,    // 	The ID of the user who created the comment.
});

module.exports = commentSchema;