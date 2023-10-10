var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log("Using nodemon auto restart server");
  res.render('index', { title: 'HomePage' });
});

/* GET dashboard page. */
router.get('/dashboard', function (req, res, next) {
  // console.log("Using nodemon auto restart server");
  res.render('pages/dashboard/index', { title: 'Dashboard Page' });
});

module.exports = router;
