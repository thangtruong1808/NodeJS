var express = require("express");
var router = express.Router();

const ItemsModel = require("./../../schemas/items");
const UtilsHelpers = require("./../../helpers/utils");
const ParamHelpers = require("./../../helpers/params");
const systemConfig = require("./../../configs/system");
const linkIndex = "/" + systemConfig.prefixAdmin + "/items/";

const pageTitleIndex = "Item Management";
const pageTitleAdd = pageTitleIndex + " - ADD";
const pageTitleEdit = pageTitleIndex + " - EDIT";

/* GET item-list. */
router.get("(/status/:status)?", (req, res, next) => {
  let objWhere = {};
  let keyword = ParamHelpers.getParam(req.query, "keyword", "");
  let currentStatus = ParamHelpers.getParam(req.params, "status", "all");
  let statusFilter = UtilsHelpers.createFilterStatus(currentStatus);
  let paginationObj = {
    totalItems: 1,
    totalItemsPerPage: 2,
    currentPage: parseInt(ParamHelpers.getParam(req.query, "page", 1)),
    pageRanges: 5,
  };

  if (currentStatus === "all") {
    if (keyword !== "") objWhere = { name: new RegExp(keyword, "i") };
  } else {
    objWhere = { status: currentStatus, name: new RegExp(keyword, "i") };
  }
  // if (currentStatus !== "all") objWhere.status = currentStatus;
  // if (keyword !== "") objWhere.name = new RegExp(keyword, "i");

  ItemsModel.countDocuments(objWhere).then((data) => {
    paginationObj.totalItems = data;
    ItemsModel.find(objWhere)
      .sort({ name: "asc" })
      .skip((paginationObj.currentPage - 1) * paginationObj.totalItemsPerPage)
      .limit(paginationObj.totalItemsPerPage)
      .then((items) => {
        res.render("pages/items/list", {
          pageTitle: pageTitleIndex,
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

  ItemsModel.findByIdAndUpdate({ _id: id }, { status: status }, (err, data) => {
    req.flash("success", data.name + " has been updated Successfully.", false);
    res.redirect(linkIndex);
  });
});

// Change ordering - Multi
router.post("/change-ordering", (req, res, next) => {
  let icds = req.body.cid;
  let orderings = req.body.ordering;

  if (Array.isArray(icds)) {
    icds.forEach((item, index) => {
      ItemsModel.updateOne(
        { _id: item },
        { ordering: parseInt(orderings[index]) },
        (err, data) => {}
      );
    });
  } else {
    ItemsModel.updateOne(
      { _id: icds },
      { ordering: parseInt(orderings) },
      (err, data) => {}
    );
  }
  req.flash(
    "success",
    " Items have been updated orderings successfully.",
    false
  );
  res.redirect(linkIndex);
});

// Change Multiple Status
router.post("/change-status/:status", (req, res, next) => {
  let currentStatus = ParamHelpers.getParam(req.params, "status", "active");

  ItemsModel.updateMany(
    { _id: { $in: req.body.cid } },
    { status: currentStatus },
    (err, data) => {
      req.flash(
        "success",
        data.n + " Items have been updated successfully.",
        false
      );
      res.redirect(linkIndex);
    }
  );
});

// Delete an Item
router.get("/delete/:id/", (req, res, next) => {
  let id = ParamHelpers.getParam(req.params, "id", "");
  ItemsModel.findOneAndDelete({ _id: id }, (err, data) => {
    req.flash("success", data.name + " has been deleted successfully.", false);
    res.redirect(linkIndex);
  });
});

// Delete Multiple Items
router.post("/delete", (req, res, next) => {
  // let currentStatus = ParamHelpers.getParam(req.params, "status", "active");
  ItemsModel.deleteMany({ _id: { $in: req.body.cid } }, (err, data) => {
    req.flash(
      "success",
      data.n + "Items have been deleted successfully.",
      false
    );
    res.redirect(linkIndex);
  });
});

/* Add an Item. */
router.get("/form(/:id)?", function (req, res, next) {
  let id = ParamHelpers.getParam(req.params, "id", "");
  let item = {
    name: "",
    ordering: 0,
    status: "novalue",
    date: "",
  };

  if (id === "") {
    //Add new Item
    res.render("pages/items/form", {
      pageTitle: pageTitleAdd,
      title: "Add Item Page",
      item,
    });
  } else {
    //Edit Item
    ItemsModel.findById({ _id: id }, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        res.render("pages/items/form", {
          pageTitle: pageTitleEdit,
          title: "Edit Item Page",
          item,
        });
      }
    });
  }
});

module.exports = router;
