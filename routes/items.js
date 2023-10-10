var express = require('express');
var router = express.Router();

/* GET item-list. */
router.get('/list', function(req, res, next) {
    res.render('pages/items/list.ejs', { pageTitle: 'Welcome to List Page', title:"List Page"});
});

/* GET item-list. */
router.get('/add', function(req, res, next) {
    res.render('pages/items/add.ejs', { pageTitle: 'Welcome to Add Item Page', title:"Add Item Page" });
});

module.exports = router;
