const { Router } = require('express')

const usersRouter = require('./users.routes')
const dishesRouter = require('./dishes.routes')
const ingredientsRouter = require('./ingredients.routes')
const sessionsRouter = require('./sessions.routes')

const routes = Router()
routes.use('/sessions', sessionsRouter)
routes.use('/dishes', dishesRouter)
routes.use('/users', usersRouter)
routes.use('/ingredients', ingredientsRouter)

module.exports = routes