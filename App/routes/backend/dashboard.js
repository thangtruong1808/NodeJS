var express = require("express");
var router = express.Router();

const folderView = __path_views + "pages/public/";

/* GET Dashboard page. */
router.get("/", function (req, res, next) {
  res.render(`${folderView}index`, {
    pageTitle: "Welcome to Dashboard ",
    title: "Dashboard",
    courseName: "<p>NodeJS</p>",
  });
});

module.exports = router;
