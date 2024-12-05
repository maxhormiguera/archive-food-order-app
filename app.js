if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const cors = require('cors');
const vhost = require('vhost');
// const helmet = require('helmet');
const logger = require('morgan');
const express = require('express');
const createError = require('http-errors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const MongoDBStore = require('connect-mongodb-session')(session);

// const api = require('./routes/api');
// const auth = require('./routes/auth');

// require('./routes/auth');
const passport = require('passport');

const app = express();

// const store = new MongoDBStore({
//   uri: process.env.MONGO_URL,
//   collection: 'session',
// });

const corsOption = {
  origin: process.env.CLIENT_URL,
  preflightContinue: false,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true
};

const sessionOption = {
  secret: process.env.COOKIE_SECRET,
  resave: false,
  key: 'sid',
  saveUninitialized: false,
  proxy: true, // add this line
  // store: store,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV == 'production' ? true : false,
  },
};

app.use(cors(corsOption));
// app.use(helmet({ contentSecurityPolicy: false }));
app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.enable('trust proxy');
app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());

const listEat = require('./Route');
// const help = require('./Route/help');
// const whatsnew = require('./Route/whatsnew');
// const accounts = require('./Route/accounts');
// const forms = require('./Route/forms');

app.use('/api', api);
app.use('/auth', auth);
// app.use('/wn', whatsnew);
// app.use('/a', accounts);

app.use(vhost('localhost.com:8080', listeat))
// app.use(vhost('help.lmcenter.reviews', help));
// app.use(vhost('whatsnew.lmcenter.reviews', whatsnew));
// app.use(vhost('accounts.lmcenter.reviews', accounts));
// app.use(vhost('forms.lmcenter.reviews', forms));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (error, req, res, next) {
  // render the error page
  const errStatus = error.statusCode || 500;
  const errMessage = error.message;
  const data = error.data;
  res.status(errStatus).json({ message: errMessage, data, status: errStatus });
});

module.exports = app;
