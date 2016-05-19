"use strict";

var express = require("express");
var router = express.Router();

var Album = require('../models/album');

router.get("/", function (request, response) {
    Album.getAlbums(function (error, albumsData) {
        if (error) response.send(error);
        response.send(albumsData);
    });
});

module.exports = router;