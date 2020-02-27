var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');

var indexRouter = require('./server/routes/route_index');
var usersRouter = require('./server/routes/users');
const flash = require('express-flash-notification');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.urlencoded())
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(cookieParser());
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(cookieParser());
app.use(flash(app));


module.exports = app;

const port = 3000;
app.listen(port, (req, res) => {
  require('./server/configuration/database');
  console.log("app started on port " + port);
});