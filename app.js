var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const { MongoClient } = require("mongodb");

const systemConfig = require('./configs/system')
const ItemsModel = require('./schemas/items');

// async function run() {
//   const uri =
//     "mongodb+srv://oliverthangtruong:cvrnjjPt96sKnj16@nodejs.9fbzhbv.mongodb.net/NodeJSDB";
  
//   const client = new MongoClient(uri);
  
//   try {
//     await client.connect();

//     console.log("Database Connected Successfully ")

//     const db = client.db("NodeJSDB");
//     const coll = db.collection("Items");

//     // find code goes here
//     const cursor = coll.find();
//     // iterate code goes here
//     await cursor.forEach(console.log);
//     // console.log(cursor)
    
//   } catch (e) {
//         console.error(e);
//   }
//   finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

mongoose.connect('mongodb+srv://oliverthangtruong:cvrnjjPt96sKnj16@nodejs.9fbzhbv.mongodb.net/NodeJSDB');

var db = mongoose.connection;

db.on('error', () => {
  console.log("Connection to Database Error ! ! ! " + err)
});
db.once('open', () => {
  console.log("Database Connected Successfully ")
});

// ItemsModel.find({}, function(err, items) {
//   console.log(items)
//   console.log(err)
// });


// Using callbacks
// ItemsModel.find({}, function (err, items) {
//   console.log(items)
//   console.log(err)
// });

ItemsModel.find({}, function (err, items) {
    if (err){
      console.log('err', err);
    }
    if (!items){
        console.log('No data in the collection');
   }
      console.log('items : ', items);
})


// var indexRouter = require('./routes/index');
// var ItemsRouter = require('./routes/items');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'backend');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//Local variable
app.locals.systemConfig = systemConfig;

//Setup Router
app.use(`/${systemConfig.prefixAdmin}`, require('./routes/backend/index'));
app.use('/', require('./routes/frontend/index'));
// app.use('/admin/dashboard', require('./routes/backend/dashboard'));
// app.use('/admin/items', require('./routes/backend/items'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error', {pageTitle: 'Page Not Found !',  title: "Error Page"});
});

module.exports = app;
