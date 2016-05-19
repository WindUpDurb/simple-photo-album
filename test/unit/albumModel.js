"use strict";

var expect = require("chai").expect;

var Album = require("../../models/album");
var Image = require("../../models/image");

var mongoose = require("mongoose");
var MONGOURL = `mongodb://localhost/simple-photo-album-test`;


before(function (callback) {
    mongoose.connection.close(function () {
        mongoose.connect(MONGOURL, callback)
    })
});

after(function (callback) {
    mongoose.connection.close(callback)
});


beforeEach(function (callback) {
    Album.remove({}, function (error) {
        if (error) return callback(error);
        Album.create({ albumName: "testAlbum", _id: "573d382aa6f851a00c15f9c0", albumImages: ["573d40daecf7c2ae10711111"]  }, function (error, newAlbum) {
            if (error) return callback(error);
            callback();
        })
    });
});

beforeEach(function (callback) {
    Image.remove({}, function (error) {
        if (error) return callback(error);
        Image.uploadImage({ _id: "573d40daecf7c2ae107a5cf9", imageUrl: "someUrl", photoTitle: "Hot babes" }, function (error, uploadedImage) {
            if (error) return callback(error);
            Image.uploadImage({
                _id: "573d40daecf7c2ae10711111",
                imageUrl: "anotherUrl",
                photoTitle: "toRemove",
                albumsIn: ["573d382aa6f851a00c15f9c0"]
            }, function (error, uploadedToRemove) {
                if (error) return callback(error);
                callback();
            });
        });
    });
});


describe("AlbumModel", function () {

    describe(".addImageToAlbum()", function () {
        it("should add a specific image to a specific album", function (callback) {
            var testImageToAdd = { _id: "573d40daecf7c2ae107a5cf9" };
            var testAlbum = { _id: "573d382aa6f851a00c15f9c0" };
            Album.addImageToAlbum(testImageToAdd, testAlbum, function (error, savedAlbum, savedImage) {
                expect(error).to.not.exist;
                expect(savedAlbum.albumImages[1].toString()).to.equal("573d40daecf7c2ae107a5cf9");
                expect(savedImage.albumsIn[0].toString()).to.equal("573d382aa6f851a00c15f9c0");
                callback();
            });
        });
    });

    describe(".removeImageFromAlbum", function () {
        it("should remove a specific image from a specific album", function (callback) {
            var imageToRemove = { _id: "573d40daecf7c2ae10711111" };
            var albumToRemoveFrom = { _id : "573d382aa6f851a00c15f9c0" };
            Album.removeImageFromAlbum(imageToRemove, albumToRemoveFrom, function (error, savedImage, savedAlbum) {
                console.log("Saved album: ", savedAlbum);
                console.log("Saved image: ", savedImage);
                expect(error).to.not.exist;
                expect(savedAlbum.albumImages).to.have.length(0);
                expect(savedImage.albumsIn).to.have.length(0);
                callback();
            })
        });
    });

    describe(".getAlbums()", function () {
        it("should retrieve all of the albums from Mongo", function (callback) {
            Album.getAlbums(function (error, albumsData) {
                expect(error).to.not.exist;
                expect(albumsData[0].albumName).to.equal("testAlbum")
                callback();
            });
        });
    });

    describe(".getSpecificAlbum()", function () {
        it("should retrieve the data of one specific album stored on Mongo", function (callback) {
            Album.getSpecificAlbum({ _id: "573d382aa6f851a00c15f9c0"}, function (error, albumData) {
                expect(error).to.not.exist;
                expect(albumData.albumName).to.equal("testAlbum");
                callback();
            });
        });
    });

    describe(".createAlbum()", function () {
        it("should create a new album on Mongo", function (callback) {
            var testAlbum = {
                albumName: "dopeAlbum"
            };
            Album.createAlbum(testAlbum, function (error, createdAlbum) {
                expect(error).to.not.exist;
                expect(createdAlbum.albumName).to.equal("dopeAlbum");
                callback();
            });
        });
    });

    describe(".deleteAlbum()", function () {
        it("should delete a specific album on Mongo.", function (callback) {
            var albumToDelete = { _id: "573d382aa6f851a00c15f9c9" };
            Album.deleteAlbum(albumToDelete._id, function (error) {
                expect(error).to.not.exist;
                callback();
            })
        })
    })



});