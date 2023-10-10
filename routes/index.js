var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log("Using nodemon auto restart server");
  res.render('index', { title: 'Express' });
});

module.exports = router;
