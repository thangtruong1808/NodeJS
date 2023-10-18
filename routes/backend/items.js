var express = require("express");
var router = express.Router();

const ItemsModel = require("./../../schemas/items");
const UtilsHelpers = require("./../../helpers/utils");
const ParamHelpers = require("./../../helpers/params");

/* GET item-list. */
router.get("(/:status)?", (req, res, next) => {
  let objWhere = {};
  let currentStatus = ParamHelpers.getParam(req.params, "status", "all");

  let statusFilter = UtilsHelpers.createFilterStatus(currentStatus);

  if (currentStatus !== "all") objWhere = { status: currentStatus };

  ItemsModel.find(objWhere).then((items) => {
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
