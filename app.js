var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

var indexRouter = require('./server/routes/route_index');
var usersRouter = require('./server/routes/users');
const flash = require('express-flash-notification');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var app = express();
const crypto = require('crypto');
const cors = require('cors');
const errorHandler = require('errorhandler');
require('./server/models/User_model');
require('./server/configuration/passport'); 

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

// view engine setup
//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

app.use(flash(app));

app.use((req, res, next) => {
  // Get auth token from the cookies
  const authToken = req.cookies['AuthToken'];

  // Inject the user to the request
  req.user = authTokens[authToken];

  next();
});

module.exports = app;

const port = 3000;
app.listen(port, (req, res) => {
  require('./server/configuration/database');
  console.log("app started on port " + port);
});