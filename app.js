var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var aboutRouter = require('./routes/aboutRoute');
var contactRoute = require('./routes/contactRoute');
var flowerRoute = require('./routes/flowersRoute');
var loginRoute = require('./routes/loginRoute');
var storesRoute = require('./routes/storesRoute');
var usersRoute = require('./routes/usersRoute');

const User = require('./models')("User");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(aboutRouter);
app.use(contactRoute);
app.use(flowerRoute);
app.use(loginRoute);
app.use(storesRoute);
app.use(usersRoute);

app.get('/', async function (req, res, next) {
  let usersArr = await User.REQUEST();
  usersArr = usersArr.filter(user => user['flag']);
  let params = new URLSearchParams(req.query);
  let user = usersArr.find(existUser => existUser.email === params.get("user"));
  console.log("server user: ", user);
  setTimeout(function () {
    user = JSON.stringify(user);
    res.render('index', { "Myuser": user });
  }, 100);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
