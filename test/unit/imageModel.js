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
    Image.remove({}, function (error) {
        if (error) return callback(error);
        Image.create({ _id : "573d40daecf7c2ae107a5cf0", imageUrl: "someUrl", photoTitle: "Tight Photo with the Homies" }, function (error, uploadedPhoto) {
            if (error) return callback(error);
            callback();
        });
    });
});

describe("Image", function () {

    describe(".uploadImage()", function () {
        it("should upload a single photo unaffiliated with an album to Mongo", function (callback) {
            var testData = {
                imageUrl : "anotherUrl",
                photoTitle : "Hot chicks"
            };
            Image.uploadImage(testData, function (error, uploadedPhoto) {
                expect(error).to.not.exist;
                expect(uploadedPhoto.photoTitle).to.equal("Hot chicks");
                callback();
            });
        });
    });

    describe(".deleteImage()", function () {
        it("should delete a specific image stored on Mongo", function (callback) {
            var imageToDelete = { _id : "573d40daecf7c2ae107a5cf0"};
            Image.deleteImage(imageToDelete._id, function (error) {
                expect(error).to.not.exist;
                callback();
            })
        })
    })


});
