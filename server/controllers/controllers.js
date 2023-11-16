const models = require('../models/models.js')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "SECRETTETRISSERVERSIDE"

const signup = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await models.createUser(username, password)
        res.status(200).json({ message: "User Created", user_id: Number(user["insertId"]) })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message })
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
        res.status(500).json({ message: "Something went wrong", error: err.message })
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

const getUserHighScores = async (req, res) => {
    try {
        const highScores = await models.getUserHighScores(req.params.id)
        res.status(200).json(highScores)
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

const addScore = async (req, res) => {
    try {
        const { user_id, score } = req.body
        const newScore = await models.addScore(user_id, score)
        res.status(200).json({ message: "Score Added", score_id: Number(newScore["insertId"]) })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message })
    }
}

const deleteScores = async (req, res) => {
    try {
        const deletedScores = await models.deleteScores(req.params.id)
        res.status(200).json({ message: "Scores Deleted", deletedScores: deletedScores["affectedRows"]})
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message })
    }
}

module.exports = {
    signup,
    login,
    getHighScores,
    getUserHighScores,
    addScore,
    deleteScores
}