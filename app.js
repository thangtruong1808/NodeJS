var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
// const { MongoClient } = require("mongodb");

const systemConfig = require("./configs/system");

mongoose.connect(
  "mongodb+srv://oliverthangtruong:cvrnjjPt96sKnj16@nodejs.9fbzhbv.mongodb.net/NodeJSDB"
);

var db = mongoose.connection;

db.on("error", () => {
  console.log("Connection to Database Error ! ! ! " + err);
});
db.once("open", () => {
  console.log("Database Connected Successfully ");
});

// var indexRouter = require('./routes/index');
// var ItemsRouter = require('./routes/items');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "backend");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Local variable
app.locals.systemConfig = systemConfig;

//Setup Router
app.use(`/${systemConfig.prefixAdmin}`, require("./routes/backend/index"));
app.use("/", require("./routes/frontend/index"));
// app.use('/admin/dashboard', require('./routes/backend/dashboard'));
// app.use('/admin/items', require('./routes/backend/items'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("pages/error", {
    pageTitle: "Page Not Found !",
    title: "Error Page",
  });
});

module.exports = app;
