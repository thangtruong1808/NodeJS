var express = require('express');
var router = express.Router();

/* GET Homepage. */
router.get('/', function (req, res, next) {
  res.render('pages/public/index',
    { pageTitle: 'Welcome to HomePage - FrontEnd', title: "HomePage-FrontEnd" });
});

module.exports = router;
