var express = require('express');
var router = express.Router();

/* GET Dashboard page. */
router.get('/', function (req, res, next) {
  res.render('pages/dashboard/index',
    { pageTitle: 'Welcome to Dashboard ', title: "Dashboard", 'courseName': '<p>NodeJS</p>'});
});

module.exports = router;
