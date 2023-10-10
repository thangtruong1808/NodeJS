var express = require('express');
var router = express.Router();

/* GET item-list. */
router.get('/list', function(req, res, next) {
    res.render('pages/items/list.ejs', { title: 'Welcome to Item List Page' });
});

/* GET item-list. */
router.get('/add', function(req, res, next) {
    res.render('pages/items/add.ejs', { title: 'Welcome to Item Add Page' });
});

module.exports = router;
