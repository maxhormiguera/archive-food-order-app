const { Router } = require('express');

    let orderCountRouter = Router();
    let orderController = require('../controllers/orderController')();

  orderCountRouter.route('/:id')
    .get(orderController.orderCount)

module.exports = orderCountRouter;
