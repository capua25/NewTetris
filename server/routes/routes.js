const express = require('express')
const controllers = require('../controllers/controllers.js')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "SECRETTETRISSERVERSIDE"

const route = express.Router()

route.post('/signup', controllers.signup)

route.post('/login', controllers.login)

route.use('/scores', (req, res, next) => {
    const token = req.headers.auth
    if (token) {
        const decoded = jwt.verify(token, JWT_SECRET)
        if (decoded) {
            next()
        } else {
            res.status(401).json({ message: "Bad Token" })
        }
    } else {
        res.status(401).json({ message: "Invalid Credentials" })
    }
})

route.get('/scores', controllers.getHighScores)

route.post('/scores', controllers.addScore)

route.delete('/scores', controllers.deleteScores)

module.exports = route