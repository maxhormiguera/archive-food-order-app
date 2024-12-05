const { Router } = require('express')

const mealDeleteRouter = Router()
const foodController = require('../controllers/foodController')()

mealDeleteRouter.route('/')
  .post(foodController.deleteById)

module.exports = mealDeleteRouter
