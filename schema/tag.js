"use strict";

var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    creatorId: mongoose.Schema.Types.ObjectId,
    nickName: String,
    photoId: mongoose.Schema.Types.ObjectId
});

var Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;