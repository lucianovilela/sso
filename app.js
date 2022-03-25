var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { createEngine } = require('express-react-views');
var passport = require('passport');
require('./config/passport.js');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'bla bla bla' 
}));  
// view engine setup
app.set('view engine', 'jsx');
app.engine('jsx', createEngine());

app.set('views', path.join(__dirname, 'view-react/src'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(passport.initialize());
app.use(passport.session());

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function (req, res) {
    res.redirect('https://3000-lucianovilela-sso-ivtucl3oznj.ws-us38.gitpod.io');
  }
);
app.post('/adfs/postResponse',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function (req, res) {
    res.redirect('https://3000-lucianovilela-sso-ivtucl3oznj.ws-us38.gitpod.io');
  }
);
function validUser(req, res, next) {
  if (!req.user) {
    res.redirect('https://3000-lucianovilela-sso-ivtucl3oznj.ws-us38.gitpod.io/login');
  }
  next();
}
app.get('/secure', validUser, usersRouter);


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  console.log(`error:${err.message}`);
  console.log(`${err.stack}`);
  res.render('error.jsx');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
module.exports = app;
