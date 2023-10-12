var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');


const systemConfig = require('./configs/system')





main().catch(err => console.log("Connection to Database Error ! ! ! "));

async function main() {
  await mongoose.connect('mongodb+srv://oliverthangtruong:cvrnjjPt96sKnj16@nodejs.9fbzhbv.mongodb.net/NodeJSDB');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

  //  const itemSchema = new mongoose.Schema({
  //   name: String
  //  });
  
  const kittySchema = new mongoose.Schema({
    name: String
  });

    // NOTE: methods must be added to the schema before compiling it with mongoose.model()
  kittySchema.methods.speak = function speak() {
    const greeting = this.name
      ? 'Meow name is ' + this.name
      : 'I don\'t have a name';
    console.log(greeting);
  };
  // const myItem = mongoose.model('Item', itemSchema);
  const Kitten = mongoose.model('Kitten', kittySchema);

  // const thangtruong = new myItem({ name: 'THANG-TRUONG' });
  const fluffy = new Kitten({ name: 'fluffy' });
  fluffy.speak();

  // await thangtruong.save();
  await fluffy.save();  
   fluffy.speak();
  // const myResult = await myItem.find();
  // const myResult2 = await Kitten.find();
  // // console.log(myResult);
  // console.log(myResult2);
}


// mongoose.connect('mongodb+srv://oliverthangtruong:cvrnjjPt96sKnj16@nodejs.9fbzhbv.mongodb.net/?retryWrites=true&w=majority');

// var db = mongoose.connection;

// db.on('error', () => {
//   console.log("Connection Error by THANG-TRUONG");
// });

// db.once('open', () => {
//   console.log("Connection Connected Successfully !");
// })

// const kittySchema = new mongoose.Schema({
//   name: String
// });

// kittySchema.methods.speak = function speak() {
//   const greeting = this.name
//     ? 'Meow name is ' + this.name
//     : 'I don\'t have a name';
//   console.log(greeting);
// };

// const Kitten = mongoose.model('Kitten', kittySchema);

// const silence = new Kitten({ name: 'Silence' });
// // console.log(silence.name); // 'Silence
// // silence.save(function (err, silence) {
// //   if (err) return console.log("Error 2");




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
