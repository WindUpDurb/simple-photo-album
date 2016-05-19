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
        Album.create({ albumName: "testAlbum", _id: "573d382aa6f851a00c15f9c9" }, function (error, newAlbum) {
            if (error) return callback(error);
            callback();
        })
    });
});


describe("AlbumModel", function () {

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
            Album.getSpecificAlbum({ _id: "573d382aa6f851a00c15f9c9"}, function (error, albumData) {
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




});