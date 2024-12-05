const { Router } = require('express')

const orderPrintRouter = Router()
const orderController = require('../controllers/orderController')()

orderPrintRouter.route('/:id')
  .get(orderController.orders)

orderPrintRouter.route('/monday/:id')
  .get(orderController.mondayOrders)

orderPrintRouter.route('/tuesday/:id')
  .get(orderController.tuesdatOrders)

orderPrintRouter.route('/wednesday/:id')
  .get(orderController.wednesdayOrders)

orderPrintRouter.route('/thursday/:id')
  .get(orderController.thusdayOrders)

orderPrintRouter.route('/friday/:id')
  .get(orderController.fridayOrders)

module.exports = orderPrintRouter
