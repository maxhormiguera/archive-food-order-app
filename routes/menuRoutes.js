const { Router } = require('express')

const menuRouter = Router()
const menuController = require('../controllers/menuController')()

menuRouter.route('/')
  .post(menuController.post)
  .get(menuController.get)
  .delete(menuController.deleteById)

menuRouter.route('/:id')
  .get(menuController.getByID)
  .put(menuController.putByID)

menuRouter.route('/forOrder')
  .get(menuController.getMenu)

module.exports = menuRouter
