const express = require('express')

const registerController = require('../controllers/register')
const alexaController = require('../controllers/alexa')

const routes = express.Router()
routes.post('/register', registerController.index)
routes.post('/alexa', alexaController.index)

module.exports = routes
