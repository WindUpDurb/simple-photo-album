"use strict";

var express = require("express");
var router = express.Router();

router.use("/albums", require("./albums"));

module.exports = router;