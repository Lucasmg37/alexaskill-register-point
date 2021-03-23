const express = require('express')

const registerController = require('../controllers/register')

const routes = express.Router()
routes.get('/register', registerController.index)

module.exports = routes
