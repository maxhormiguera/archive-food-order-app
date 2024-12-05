const { Router } = require('express');

    let userDeleteRouter = Router();
    let userController = require('../controllers/userController')();

    userDeleteRouter.route('/')
        .post(userController.deleteById)

module.exports = userDeleteRouter;
