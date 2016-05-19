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

albumSchema.statics.deleteAlbum = function (albumData, callback) {
    Album.findByIdAndRemove(albumData._id, function (error) {
        if (error) return callback(error);
        callback(null);
    });
};

albumSchema.statics.addImageToAlbum = function (imageToAdd, albumToAddTo, callback) {
    Album.findById(albumToAddTo._id, function (error, albumData) {
        if (error || !albumData) return callback(error || "There is no album.");
        Image.findById(imageToAdd._id, function (error, imageData) {
            if (error || !imageData) return callback(error || "There is no image.");
            albumData.albumImages.push(imageData._id);
            imageData.albumsIn.push(albumData._id);
            albumData.save(function (error, savedAlbum) {
                if (error) return callback(error);
                imageData.save(function (error, savedImage) {
                    if (error) return callback(error);
                    callback(null, savedAlbum, savedImage);
                });
            });
        });
    });
};

albumSchema.statics.removeImageFromAlbum = function (imageToRemove, albumToRemoveFrom, callback) {
    Album.findById(albumToRemoveFrom._id, function (error, albumData) {
        if (error || !albumData) return callback(error || { error: "There is no album" });
        Image.findById(imageToRemove._id, function (error, imageData) {
            if (error || !imageData) return callback(error || { error: "There is no photo." });

            var indexOfImage = albumData.albumImages.indexOf(imageData._id);
            albumData.albumImages.splice(indexOfImage, 1);

            var indexOfAlbum = imageData.albumsIn.indexOf(albumData._id);
            imageData.albumsIn.splice(indexOfAlbum, 1);

            albumData.save(function (error, savedAlbum) {
                if (error) return callback(error);
                imageData.save(function (error, savedImage) {
                    if (error) return callback(error);
                    callback(null, savedImage, savedAlbum);
                });
            });
        });
    });
};

var Album = mongoose.model("Album", albumSchema);

module.exports = Album;
