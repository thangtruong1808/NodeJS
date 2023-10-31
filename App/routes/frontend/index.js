var express = require("express");
var router = express.Router();

const folderView = __path_views + "pages/public/";

router.use("/", require("./home"));

module.exports = router;
