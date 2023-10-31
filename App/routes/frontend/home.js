var express = require("express");
var router = express.Router();

const folderView = __path_views + "pages/public/";

/* GET Homepage. */
router.get("/", function (req, res, next) {
  res.render(`${folderView}index`, {
    pageTitle: "Welcome to HomePage - FrontEnd",
    title: "HomePage-FrontEnd",
  });
});

module.exports = router;
