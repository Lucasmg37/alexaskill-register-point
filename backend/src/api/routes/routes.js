const express = require('express')

const registerController = require('../controllers/register')
const alexaController = require('../controllers/alexa')
const indexController = require('../controllers/index')

const routes = express.Router()
routes.post('/register', registerController.index)
routes.post('/alexa', alexaController.index)
routes.get('/', indexController.index)

module.exports = routes
