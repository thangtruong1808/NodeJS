var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log("Using nodemon auto restart server");
  res.render('index', { pageTitle: 'Welcome to HomePage', title:"HomePage" });
});

/* GET dashboard page. */
router.get('/dashboard', function (req, res, next) {
  // console.log("Using nodemon auto restart server");
  res.render('pages/dashboard/index', { pageTitle: 'Welcome to Dashboard ', title:"Dashboard" });
});

module.exports = router;
