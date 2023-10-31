var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const validator = require("express-validator");
const session = require("express-session");
const flash = require("express-flash-notification");
var expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

//Define Path
global.__base = __dirname + "/";
global.__path_app = __base + "App/";
global.__path_configs = __path_app + "configs/";
global.__path_helpers = __path_app + "helpers/";
global.__path_routes = __path_app + "routes/";
global.__path_schemas = __path_app + "schemas/";
global.__path_validates = __path_app + "validates/";
global.__path_views = __path_app + "views/";

console.log("__path_configs: " + __path_configs);

const systemConfig = require(__path_configs + "system");
const databaseConfig = require(__path_configs + "database");

mongoose.connect(
  `mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@nodejs.9fbzhbv.mongodb.net/${databaseConfig.database}`
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
app.use(cookieParser());
app.use(
  session({
    secret: "thang-truong",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  flash(app, {
    viewName: __path_views + "elements/notify",
  })
);

app.use(
  validator({
    customValidators: {
      isNotEqual: (value1, value2) => {
        return value1 !== value2;
      },
      isValidDate: (value) => {
        if (!value.match(/^\d{2}-\d{2}-\d{4}$/)) return false;
      },
    },
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", __path_views + "backend");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//Local variable
app.locals.systemConfig = systemConfig;

//Setup Router
app.use(
  `/${systemConfig.prefixAdmin}`,
  require(__path_routes + "backend/index")
);
app.use("/", require(__path_routes + "frontend/index"));
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
  res.render(__path_views + "pages/error", {
    pageTitle: "Page Not Found !",
    title: "Error Page",
  });
});

module.exports = app;
