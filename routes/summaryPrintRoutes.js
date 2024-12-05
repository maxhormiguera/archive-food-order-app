const { Router } = require('express');

    let summaryPrintRouter = Router();
    let orderController = require('../controllers/orderController')();

  summaryPrintRouter.route('/')
    .get(orderController.session)

    summaryPrintRouter.route('/:id')
        .get(orderController.summaryPrint)

module.exports = summaryPrintRouter;
