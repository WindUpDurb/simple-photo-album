"use strict";

var express = require("express");
var router = express.Router();

var Album = require('../models/album');

router.route("/")
    .get(function (request, response) {
        Album.getAlbums(function (error, albumsData) {
            if (error) response.send(error);
            response.send(albumsData);
        })
    })
    .post(function (request, response) {
        var newAlbumData = request.body;
        Album.createAlbum(newAlbumData, function (error, newAlbum) {
            if (error) response.status(400).send(error);
            response.send(newAlbum);
        });
    });
        
router.put("/addImage", function (request, response) {
    var imageToAdd = request.body.imageId;
    var albumToAddTo = request.body.albumToAddId;
    Album.addImageToAlbum(imageToAdd, albumToAddTo, function (error, savedAlbum, savedImage) {
        if (error) response.status(400).send();
        response.send({ savedAlbum: savedAlbum, savedImage: savedImage });
    });
});

router.put("/removeFromAlbum", function (request, response) {
    var imageToRemove = request.body.imageId;
    var albumToRemoveFrom = request.body.albumId;
    Album.removeImageFromAlbum(imageToRemove, albumToRemoveFrom, function (error, savedImage, savedAlbum) {
        if (error) response.status(400).send();
        response.send({ savedImage: savedImage, savedAlbum: savedAlbum });
    });
});

router.put("/updateAlbumName", function (request, response) {
    Album.updateAlbumName(request.body, function (error, updatedAlbum) {
        if (error) response.status(400).send();
        response.send(updatedAlbum);
    });
});
        

router.get("/:albumId", function (request, response) {
   var albumId = request.params.albumId;
    Album.getSpecificAlbum(albumId, function (error, albumData) {
        if (error) response.status(400).send(error);
        response.send(albumData);
    });
});

router.delete("/", function (request, response) {
    var toDelete = request.body._id;
    Album.deleteAlbum(toDelete, function (error) {
        if (error) response.status(400).send(error);
        response.send("Album has been deleted.");
    });
});

module.exports = router;