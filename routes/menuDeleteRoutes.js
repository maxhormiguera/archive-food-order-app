const { Router } = require('express');

    let menuDeleteRouter = Router();
    let menuController = require('../controllers/menuController')();

    menuDeleteRouter.route('/')
        .post(menuController.deleteById)

module.exports = menuDeleteRouter;
