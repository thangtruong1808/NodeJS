var express = require("express");
var router = express.Router();
const util = require("util");

const systemConfig = require(__path_configs + "system");
const notify = require(__path_configs + "notify");

const ItemsModel = require(__path_schemas + "items");
const ValidateItems = require(__path_validates + "items");
const UtilsHelpers = require(__path_helpers + "utils");
const ParamHelpers = require(__path_helpers + "params");

const e = require("connect-flash");
const linkIndex = "/" + systemConfig.prefixAdmin + "/items/";

const pageTitleIndex = "Item Management";
const pageTitleAdd = pageTitleIndex + " - ADD";
const pageTitleEdit = pageTitleIndex + " - EDIT";
const folderView = __path_views + "pages/items/";

/* GET item-list. */
router.get("(/status/:status)?", (req, res, next) => {
  let objWhere = {};
  let keyword = ParamHelpers.getParam(req.query, "keyword", "");
  let currentStatus = ParamHelpers.getParam(req.params, "status", "all");
  let statusFilter = UtilsHelpers.createFilterStatus(currentStatus);
  let paginationObj = {
    totalItems: 1,
    totalItemsPerPage: 10,
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
        res.render(`${folderView}list`, {
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
    req.flash("success", notify.notify.CHANGED_STATUS_SUCCESS, false);
    res.redirect(linkIndex);
  });
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
        util.format(notify.notify.CHANGED_MULTI_STATUS_SUCCESS, data.n),
        false
      );
      res.redirect(linkIndex);
    }
  );
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
    util.format(notify.notify.CHANGE_ORDERING_SUCCESS, icds.length),
    false
  );
  res.redirect(linkIndex);
});

// Delete an Item
router.get("/delete/:id/", (req, res, next) => {
  let id = ParamHelpers.getParam(req.params, "id", "");
  ItemsModel.findOneAndDelete({ _id: id }, (err, data) => {
    req.flash("success", notify.notify.DELETE_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// Delete Multiple Items
router.post("/delete", (req, res, next) => {
  // let currentStatus = ParamHelpers.getParam(req.params, "status", "active");
  ItemsModel.deleteMany({ _id: { $in: req.body.cid } }, (err, data) => {
    req.flash(
      "success",
      util.format(notify.notify.DELETE_MULTI_SUCCESS, data.n),
      false
    );
    res.redirect(linkIndex);
  });
});

// Save and Edit an Item
router.post("/save", (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  ValidateItems.validator(req);
  let item = Object.assign(req.body);
  console.log("item: " + item);

  let errors = req.validationErrors();

  if (typeof item !== "undefined" && item.id != "") {
    //edit
    if (errors) {
      res.render(`${folderView}form`, {
        pageTitle: pageTitleAdd,
        title: pageTitleEdit,
        item,
        errors,
      });
    } else {
      ItemsModel.updateOne(
        { _id: item.id },
        {
          name: item.name,
          ordering: parseInt(item.ordering),
          status: item.status,
          date: item.date,
        },
        (err, result) => {
          if (err) {
            console.log(err);
          }
          req.flash("success", notify.notify.EDIT_SUCCESS, false);
          res.redirect(linkIndex);
        }
      );
    }
  } else {
    //add
    if (errors) {
      res.render(`${folderView}form`, {
        pageTitle: pageTitleAdd,
        title: pageTitleAdd,
        item,
        errors,
      });
    } else {
      // let myItem = {
      //   name: ParamHelpers.getParam(req.body, "name", ""),
      //   ordering: ParamHelpers.getParam(req.body, "ordering", 0),
      //   status: ParamHelpers.getParam(req.body, "status", "active"),
      //   date: ParamHelpers.getParam(req.body, "date", new Date()),
      // };
      new ItemsModel(item).save().then(() => {
        req.flash("success", notify.notify.ADD_SUCCESS, false);
        res.redirect(linkIndex);
      });
    }
  }
});

/* Display form. */
router.get("/form(/:id)?", function (req, res, next) {
  let id = ParamHelpers.getParam(req.params, "id", "");
  let item = {
    name: "",
    ordering: 0,
    status: "novalue",
    date: "",
  };
  let errors = null;

  if (id === "") {
    //Add new Item
    res.render(`${folderView}form`, {
      pageTitle: pageTitleAdd,
      title: "Add Item Page",
      item,
      errors,
    });
  } else {
    //Edit Item
    ItemsModel.findById({ _id: id }, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        res.render(`${folderView}form`, {
          pageTitle: pageTitleEdit,
          title: "Edit Item Page",
          item,
          errors,
        });
      }
    });
  }
});

module.exports = router;
