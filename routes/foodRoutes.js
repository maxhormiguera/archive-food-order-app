const { Router } = require('express');

const foodRouter = Router()
const foodController = require('../controllers/foodController')()

foodRouter.route('/')
  .post(foodController.post)
  .get(foodController.get)

foodRouter.route('/:id')
  .put(foodController.putByID)
  .delete(foodController.deleteById)

module.exports = foodRouter
