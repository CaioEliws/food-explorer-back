const { Router } = require('express')

const IngredientsController = require("../controllers/IngredientsController");

const ingredientsRoutes = Router()

const ingredientsController = new IngredientsController()

ingredientsRoutes.get('/', ingredientsController.index)

module.exports = ingredientsRoutes