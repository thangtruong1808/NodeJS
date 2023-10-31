var express = require("express");
var router = express.Router();

const folderView = __path_views + "pages/public/";

/* GET Admin page. */
router.get("/", function (req, res, next) {
  res.render(`${folderView}index`, {
    pageTitle: "Welcome to Admin HomePage",
    title: "HomePage",
  });
});

module.exports = router;
