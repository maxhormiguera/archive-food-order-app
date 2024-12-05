const { Router } = require('express');

    let orderRouter = Router();
    let orderController = require('../controllers/orderController')();

  orderRouter.route('/')
    .post(orderController.post)
    .get(orderController.get)

  orderRouter.route('/:id')
    .get(orderController.orderReports)

module.exports = orderRouter;
