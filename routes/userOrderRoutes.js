const { Router } = require('express')

const userOrderRouter = Router()
const orderController = require('../controllers/orderController')()

userOrderRouter.route('/')
  .get(orderController.getOrderByUser)

userOrderRouter.route('/:id')
  .get(orderController.getOrderByMenu)
  .put(orderController.putById)

module.exports = userOrderRouter
