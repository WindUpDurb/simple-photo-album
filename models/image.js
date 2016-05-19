"use strict";

var mongoose = require("mongoose");
var moment = require("moment");

var imageSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    postedAt: { type: Date, default: moment().format() },
    photoTitle: { type: String },
    albumsIn: [{ type : mongoose.Schema.Types.ObjectId, ref: "Album" }]
});

imageSchema.statics.uploadImage = function (uploadData, callback) {
    Image.create(uploadData, function (error, uploadedImage) {
        if (error) return callback(error);
        callback(null, uploadedImage);
    });
};

imageSchema.statics.retrieveImage = function (imageId, callback) {
    Image.findById(imageId, function (error, imageData) {
        if (error || !imageData) return callback(error || "There is no image.");
        callback(null, imageData);
    });
};

imageSchema.statics.deleteImage = function (imageData, callback) {
    Image.findByIdAndRemove(imageData._id, function (error) {
        if (error) return callback(error);
        callback(null);
    });
};


var Image = mongoose.model("Image", imageSchema);

module.exports = Image;
