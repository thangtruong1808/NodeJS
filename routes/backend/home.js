var express = require('express');
var router = express.Router();

/* GET Admin page. */
router.get('/', function (req, res, next) {
  res.render('pages/home/index',
    { pageTitle: 'Welcome to Admin HomePage', title: "HomePage" });
});

module.exports = router;
