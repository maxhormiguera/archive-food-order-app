const { Router } = require('express');

    let officeCountRouter = Router();
    let orderController = require('../controllers/orderController')();

  officeCountRouter.route('/:id')
    .get(orderController.officeCount)


module.exports = officeCountRouter;
