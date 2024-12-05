const { Router } = require('express')
const passport = require('passport')
const ownProfileRouter = Router()
const userController = require('../controllers/userController')()

// ownProfileRouter.route('/', passport.authenticate('google', {
//   scope: ['profile', 'email']
// }));

ownProfileRouter.route('/')
  .get(userController.ownProfile)

module.exports = ownProfileRouter
