"use strict";

var express = require("express");
var router = express.Router();

router.use("/albums", require("./albums"));
router.use("/images", require("./images"));

module.exports = router;