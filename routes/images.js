"use strict";

var express = require("express");
var router = express.Router();

var Image = require("../models/image");

router.route("/")
    .get(function (request, response) {
        Image.retrieveAllImages(function (error, imageList) {
            if (error) response.status(400).send();
            response.send(imageList);
        });
    })
    .post(function (request, response) {
        Image.create(request.body, function (error, uploadedImage) {
            if (error) response.status(400).send();
            response.send(uploadedImage);
        });
    });

router.get("/:imageId", function (request, response) {
    var imageId = request.params.imageId;
    Image.retrieveImage(imageId, function (error, imageData) {
        if (error) response.status(400).send();
        response.send(imageData);
    });
});

router.put("/updateImage", function (request, response) {
    console.log(request.body)
    Image.updateImageDescription(request.body, function (error, updatedImage) {
        if (error) response.status(400).send();
        response.send(updatedImage);
    });
});

router.delete("/deleteImage", function (request, response) {
    Image.deleteImage(request.body, function (error) {
        if (error) response.status(400).send();
        response.send("Image has been deleted");
    });
});



module.exports = router;