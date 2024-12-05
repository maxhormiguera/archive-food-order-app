const express = require('express')
const passport = require('passport')
const User = require('../models/userModel')

const router = () => {
  const googleSigninRouter = express.Router()
  // let googleSigninController = require('../controllers/googleSigninController')();

  // googleSigninRouter.use('/', (req, res, next) => {
  //     if (req.session.user) next();
  //     else res.status(403).send();
  // })

  // googleSigninRouter.route('/google')
  // .get(
  //     passport.authenticate('/google', {
  //         scope: ['https://www.googleapis.com/auth/userinfo.profile',
  //             'https://www.googleapis.com/auth/userinfo.email'
  //         ],
  //         prompt: 'select_account'
  //     })
  // );
  // googleSigninRouter.get('/logout', (req, res) => {
  //     req.logout();
  //     res.redirect('/');
  // });

  googleSigninRouter.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }))

  googleSigninRouter.route('/success')
    .get((req, res) => {
      console.log(':::', req.session)
      // req.session.user = req.session.passport.user
      // req.session.cookie.user = req.session.passport.user
      // req.session.save()
      if (req.user.email) {
        res.redirect('http://localhost:3000')
        // res.redirect('/menu');
      } else {
        const email = req.user.emails[0].value
        // console.log('req::::', req.user.emails[0].value)
        User.findOne({ email }, (err, data) => {
          if (data) {
          } else {
            res.redirect('/')
          }
        })
      }
    })

  // googleSigninRouter.use('/signin', googleSigninController.signin)

  // googleSigninRouter.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  //     // res.send(req.user);
  //     res.redirect('/menu');
  //     // res.send('naka sud na ka')
  // });

  googleSigninRouter.get('/google/redirect', passport.authenticate('google', {
    successRedirect: '/auth/success',
    failureRedirect: '/loginFailed'
  }))

  googleSigninRouter.route('/success')
    .get((req, res) => {
      // console.log(':::', req)
      if (req.user.email) {
        res.redirect('http://localhost:3000/menu')
      } else {
        const email = req.user.emails[0].value
        // console.log('req::::', req.user.emails[0].value)
        User.findOne({ email }, (err, data) => {
          if (data) {
          } else {
            res.redirect('/')
          }
        })
      }
    })

  googleSigninRouter.route('/loginFailed')
    .get((req, res) => {
      res.redirect('/')
    })

  googleSigninRouter.route('/logout')
    .get((req, res) => {
      req.logout()
      req.session.destroy((err) => {
        // if (err) { res.status(500) } else { res.redirect(`${req.protocol}://lmcenter.com:3000`) }
        if (err) { res.status(500) } else { res.redirect(`http://localhost:3000/login`) }
      })
    })

  return googleSigninRouter
}
module.exports = router
