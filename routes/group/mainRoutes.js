const express = require('express')
const async = require('async')

const router = function router (allCompanies, product) {
  const mainRouter = express.Router()

  const models = require('../../models/modelRequire')(product)
  const foodRouter = require('../foodRoutes')(models)

  mainRouter.use('/foods', foodRouter)

  return mainRouter
}

module.exports = router
