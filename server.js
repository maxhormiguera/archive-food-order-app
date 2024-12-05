const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passportSetup = require('./config/passport-setup');
let passport = require('passport');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/FoodApp', err => {
   if (err) console.log('Error', err);
   else console.log('Database is connected.');
});

var store = new MongoDBStore({
   uri: 'mongodb://localhost:27017/FoodApp',
   databaseName: 'FoodApp',
   collection: 'sessions'
})

// const PORT = process.env.PORT || 8080
const PORT = process.env.PORT || 3000

app.set('views', './views');
app.set('view engine', 'ejs');

var sess = {
   secret: 'monitor068',
   domain: 'http://localhost:3000',
   cookie: {
      // maxAge: new Date(Date.now() + 7200000),
      // path: '/',
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: false,
      // sameSite: 'none',
      secure: false,
      // domain: 'http://localhost:8080',
   },
   store: store,
   resave: true,
   saveUninitialized: false
};

app.use(cookieParser())
app.use(session(sess))
app.use(passport.initialize())
app.use(passport.session())

const googleSigninRoutes = require('./routes/googleSigninRoutes')()
const foodRoutes = require('./routes/foodRoutes')
const menuRoutes = require('./routes/menuRoutes')
const menuDeleteRoutes = require('./routes/menuDeleteRoutes')
const mealDeleteRoutes = require('./routes/mealDeleteRoutes')
const orderDeleteRoutes = require('./routes/orderDeleteRoutes')
const userDeleteRoutes = require('./routes/userDeleteRoutes')
const forOrderRoutes = require('./routes/forOrderRoutes')
const userRoutes = require('./routes/userRoutes')
const ownProfileRoutes = require('./routes/ownProfileRoutes')
const orderRoutes = require('./routes/orderRoutes')
const orderCountRoutes = require('./routes/orderCountRoutes')
const officeCountRoutes = require('./routes/officeCountRoutes')
const userOrderRoutes = require('./routes/userOrderRoutes')
const summaryPrintRoutes = require('./routes/summaryPrintRoutes')
const officePrintRoutes = require('./routes/officePrintRoutes')
const orderPrintRoutes = require('./routes/orderPrintRoutes')
const dateRoutes = require('./routes/dateRoutes')

const corsOption = {
   origin: 'http://localhost:8080',
   preflightContinue: false,
   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
   credentials: true,
};

app.use(cors(corsOption))
app.use(morgan('tiny'))
app.use(bodyParser.json())

app.use('/auth', googleSigninRoutes)
app.use('/api/google', googleSigninRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/deleteMenu', menuDeleteRoutes)
app.use('/api/deleteMeal', mealDeleteRoutes)
app.use('/api/deleteOrder', orderDeleteRoutes)
app.use('/api/deleteUser', userDeleteRoutes)
app.use('/forOrder', menuRoutes)
app.use('/api/ownProfile', ownProfileRoutes)
app.use('/api/user', userRoutes)
app.use('/api/ownProfile', userRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/orderCount', orderCountRoutes)
app.use('/api/officeCount', officeCountRoutes)
app.use('/api/forOrder', forOrderRoutes)
app.use('/userOrders', userOrderRoutes)
app.use('/api/summaryPrint', summaryPrintRoutes)
app.use('/api/officePrint', officePrintRoutes)
app.use('/api/orderPrint', orderPrintRoutes)
app.use('/api/dates', dateRoutes)
app.use('/api/user/switch', dateRoutes)

if (process.env.NODE_ENV === 'production') {
   app.use(express.static('client/dist'))
   app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
   })
} else {
   // app.get('*', (req, res) => {
   //    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
   // });
  app.use(express.static('dist'))
}

app.listen(PORT, () => console.log(`Server listing at port: ${PORT}`))
