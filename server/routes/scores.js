const express = require('express')
const controllers = require('../controllers/controllers.js')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "SECRETTETRISSERVERSIDE"

const route = express.Router()

route.use('/', (req, res, next) => {
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

route.get('/', controllers.getHighScores)

route.get('/:id', controllers.getUserHighScores)

route.post('/', controllers.addScore)

route.delete('/:id', controllers.deleteScores)

module.exports = route