const { Router } = require('express');

    let menuRouter = Router();
    let menuController = require('../controllers/menuController')();

  menuRouter.route('/')
    .get(menuController.getMenu)

module.exports = menuRouter;
