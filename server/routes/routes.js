const express = require('express')
const controllers = require('../controllers/controllers.js')

const route = express.Router()

route.post('/signup', controllers.signup)

route.post('/login', controllers.login)

module.exports = route