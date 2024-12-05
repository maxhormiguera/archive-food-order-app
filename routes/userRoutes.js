const { Router } = require('express')
const passport = require('passport')
const userRouter = Router()
const userController = require('../controllers/userController')()

userRouter.route('/', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

userRouter.route('/')
  .post(userController.post)
  .get(userController.get)

userRouter.route('/switch/:email')
  .put(userController.switchUserType)

userRouter.route('/:email')
  .put(userController.putByID)
  .delete(userController.deleteById)

userRouter.route('/ownProfile')
  .get(userController.ownProfile)

module.exports = userRouter
