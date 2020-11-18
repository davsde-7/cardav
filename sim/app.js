const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const dashboardProsumerRouter = require('./routes/dashboard_prosumer')
const dashBoardManagerRouter = require('./routes/dashboard_manager')
const profilePageRouter = require('./routes/profile_page');

const app = express();


// Database setup
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/m7011e', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true});
let db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to database"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/dashboard_prosumer', dashboardProsumerRouter);
app.use('/dashboard_manager', dashBoardManagerRouter);
app.use('/profile_page', profilePageRouter);



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
  res.render('error');
});

module.exports = app;
