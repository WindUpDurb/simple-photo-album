"use strict";

var mongoose = require("mongoose");
var Image = require("./image");

var albumSchema = new mongoose.Schema({
    albumName: { type: String, required: true},
    albumImages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }]
});

albumSchema.statics.getAlbums = function (callback) {
    Album.find({}, function (error, albumData) {
        if (error || !albumData) return callback(error || { error: "There are no albums" });
        return callback(null, albumData);
    });
};

albumSchema.statics.getSpecificAlbum = function (albumData, callback) {
    Album.findById(albumData._id, function (error, albumData) {
        if (error || !albumData) return callback(error || { error : "There is no album" });
        return callback(null, albumData);
    });
};

albumSchema.statics.createAlbum = function (newAlbumData, callback) {
    Album.create(newAlbumData, function (error, createdAlbum) {
        if (error) return callback(error);
        callback(null, createdAlbum);
    });
};

var Album = mongoose.model("Album", albumSchema);

module.exports = Album;
