const { Router } = require('express');

    let dateRouter = Router();
    let orderController = require('../controllers/orderController')();

    dateRouter.route('/:id')
        .get(orderController.dates)

module.exports = dateRouter;
