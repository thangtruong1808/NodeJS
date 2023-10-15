var express = require("express");
var router = express.Router();

const ItemsModel = require("./../../schemas/items");
const UtilsHelpers = require("./../../helpers/utils");

// const ItemsModel = require('/project-nodejs/schemas/items');
/* GET item-list. */
router.get("/", (req, res, next) => {
  const statusFilter = UtilsHelpers.createFilterStatus();

  ItemsModel.find({}).then((items) => {
    //   console.log("items : ", items);
    res.render("pages/items/list", {
      pageTitle: "Welcome to List Page",
      title: "List Page",
      items: items,
      statusFilter: statusFilter,
    });
  });
});

/* Add an Item. */
router.get("/add", function (req, res, next) {
  res.render("pages/items/add.ejs", {
    pageTitle: "Welcome to Add Item Page",
    title: "Add Item Page",
  });
});

module.exports = router;
