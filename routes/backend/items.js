var express = require("express");
var router = express.Router();

const ItemsModel = require("./../../schemas/items");
const UtilsHelpers = require("./../../helpers/utils");
const ParamHelpers = require("./../../helpers/params");

/* GET item-list. */
router.get("(/:status)?", (req, res, next) => {
  let objWhere = {};

  let keyword = ParamHelpers.getParam(req.query, "keyword", "");
  let currentStatus = ParamHelpers.getParam(req.params, "status", "all");
  let statusFilter = UtilsHelpers.createFilterStatus(currentStatus);
  let pagination = {
    totalItems: 1,
    totalItemsPerPage: 4,
    currentPage: 1,
  };
  pagination.currentPage = parseInt(
    ParamHelpers.getParam(req.query, "page", "1")
  );

  if (currentStatus === "all") {
    if (keyword !== "") objWhere = { name: new RegExp(keyword, "i") };
  } else {
    objWhere = { status: currentStatus, name: new RegExp(keyword, "i") };
  }

  ItemsModel.countDocuments(objWhere).then((data) => {
    pagination.totalItems = data;
  });

  ItemsModel.find(objWhere)
    .sort({ name: "asc" })
    .skip((pagination.currentPage - 1) * pagination.totalItemsPerPage)
    .limit(pagination.totalItemsPerPage)
    .then((items) => {
      res.render("pages/items/list", {
        pageTitle: "Welcome to List Page",
        title: "List Page",
        items: items,
        statusFilter: statusFilter,
        pagination,
        currentStatus,
        keyword,
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
