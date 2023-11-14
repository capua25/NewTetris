const models = require('../models/models.js')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "SECRETTETRISSERVERSIDE"

const signup = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await models.createUser(username, password)
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await models.login(username, password)
        if (user) {
            const token = jwt.sign({ id: user.id }, JWT_SECRET)
            res.status(200).json({ token, user })
        } else {
            res.status(401).json({ message: "Invalid Credentials" })
        }
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

const getHighScores = async (req, res) => {
    try {
        const highScores = await models.getHighScores()
        res.status(200).json(highScores)
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

const addScore = async (req, res) => {
    try {
        const { user_id, score } = req.body
        const newScore = await models.addScore(user_id, score)
        res.status(200).json(newScore)
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

const deleteScores = async (req, res) => {
    try {
        const deletedScores = await models.deleteScores(req.user_id)
        res.status(200).json(deletedScores)
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

module.exports = {
    signup,
    login,
    getHighScores,
    addScore,
    deleteScores
}