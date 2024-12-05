const { Router } = require('express');

    let officePrintRouter = Router();
    let orderController = require('../controllers/orderController')();

  officePrintRouter.route('/:id')
    .get(orderController.officePrint)

module.exports = officePrintRouter;
