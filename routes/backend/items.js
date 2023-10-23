var express = require("express");
var router = express.Router();

const ItemsModel = require("./../../schemas/items");
const UtilsHelpers = require("./../../helpers/utils");
const ParamHelpers = require("./../../helpers/params");
const systemConfig = require("./../../configs/system");

/* GET item-list. */
router.get("(/:status)?", (req, res, next) => {
  let objWhere = {};

  let keyword = ParamHelpers.getParam(req.query, "keyword", "");
  let currentStatus = ParamHelpers.getParam(req.params, "status", "all");
  let statusFilter = UtilsHelpers.createFilterStatus(currentStatus);
  let paginationObj = {
    totalItems: 1,
    totalItemsPerPage: 8,
    currentPage: parseInt(ParamHelpers.getParam(req.query, "page", "1")),
    pageRanges: 5,
  };

  if (currentStatus === "all") {
    if (keyword !== "") objWhere = { name: new RegExp(keyword, "i") };
  } else {
    objWhere = { status: currentStatus, name: new RegExp(keyword, "i") };
  }

  ItemsModel.countDocuments(objWhere).then((data) => {
    paginationObj.totalItems = data;
    ItemsModel.find(objWhere)
      .sort({ name: "asc" })
      .skip((paginationObj.currentPage - 1) * paginationObj.totalItemsPerPage)
      .limit(paginationObj.totalItemsPerPage)
      .then((items) => {
        res.render("pages/items/list", {
          pageTitle: "Welcome to List Page",
          title: "List Page",
          items: items,
          statusFilter: statusFilter,
          paginationObj,
          currentStatus,
          keyword,
        });
      });
  });
});

// Change Status
router.get("/change-status/:id/:status", (req, res, next) => {
  let currentStatus = ParamHelpers.getParam(req.params, "status", "active");
  let id = ParamHelpers.getParam(req.params, "id", "");

  let status = currentStatus === "active" ? "inactive" : "active";

  // ItemsModel.findById(id).then((itemResult) => {
  //   itemResult.status = status;
  //   itemResult.save().then((result) => {
  //     res.redirect("/admin/items");
  //   });
  // });

  ItemsModel.findByIdAndUpdate(
    { _id: id },
    { status: status },
    // {
    //   new: true,
    //   upsert: true,
    //   runValidators: true,
    // },
    (err, data) => {
      res.redirect(`/${systemConfig.prefixAdmin}/items`);
    }
  );
});
/* Add an Item. */
router.get("/add", function (req, res, next) {
  res.render("pages/items/add.ejs", {
    pageTitle: "Welcome to Add Item Page",
    title: "Add Item Page",
  });
});

module.exports = router;
