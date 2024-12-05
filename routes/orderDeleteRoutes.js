const { Router } = require('express');

    let orderDeleteRouter = Router();
    let orderController = require('../controllers/orderController')();

    orderDeleteRouter.route('/')
        .post(orderController.deleteById)

module.exports = orderDeleteRouter;
