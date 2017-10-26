var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');


const cookieParser = require('cookie-parser');
const session = require("express-session");
//validator
const expressValidator = require("express-validator");

// handlebars view
const handleBars = require("express-handlebars");

// routes
var index = require('./routes/index');
let register = require("./routes/register");
let utilities = require("./routes/utilities");
let login = require("./routes/login");
let dashboard = require("./routes/dashboard");
let query = require("./routes/query");

// APP
var app = express();


// view engine setup
app.engine("hbs", handleBars({
  extname:"hbs",
  defaultLayout: "layout",
  layoutsDir: path.join(__dirname, "/views/layout")
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// string validator
app.use(expressValidator());
// session
app.use(session({
  secret: process.env.SESSIONSECRET,
  saveUninitialized: true,
  resave: false
}));

//activate routes
app.use('/', index);
app.use("/register", register);
app.use("/utilities", utilities);
app.use("/login", login);
app.use("/dashboard", dashboard);
app.use("/query", query);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || 3000);