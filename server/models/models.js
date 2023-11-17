const database = require('mariadb')

const pool = database.createPool({
    host:"localhost", 
    user:"root", 
    password:"root", // root para casa, 1234 para trabajo
    database:"tetris"
})

const createUser = async (username, password) => {
    let conn;
    try {
        conn = await pool.getConnection()
        const rows = await conn.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, password])
        return rows
    } catch (err) {
        throw err
    } finally {
        if (conn) conn.end()
    }
}

const login = async (username, password) => {
    let conn;
    try {
        conn = await pool.getConnection()
        const rows = await conn.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password])
        if (rows.length > 0) {
            return rows[0]
        } else {
            return null
        }
    } catch (err) {
        throw err
    } finally {
        if (conn) conn.end()
    }
}

const getHighScores = async () => {
    let conn;
    try {
        conn = await pool.getConnection()
        const rows = await conn.query("SELECT users.username, scores.score FROM scores JOIN users ON users.id = scores.user_id ORDER BY score DESC LIMIT 10")
        return rows
    } catch (err) {
        throw err
    } finally {
        if (conn) conn.end()
    }
}

const getUserHighScores = async (id) => {
    let conn;
    try {
        conn = await pool.getConnection()
        const rows = await conn.query("SELECT * FROM scores WHERE user_id = ? ORDER BY score DESC", [id])
        return rows
    } catch (err) {
        throw err
    } finally {
        if (conn) conn.end()
    }
}

const addScore = async (user_id, score) => {
    let conn;
    try {
        conn = await pool.getConnection()
        const rows = await conn.query("INSERT INTO scores (user_id, score) VALUES (?, ?)", [user_id, score])
        return rows
    } catch (err) {
        throw err
    } finally {
        if (conn) conn.end()
    }
}

const deleteScores = async (user_id) => {
    let conn;
    try {
        conn = await pool.getConnection()
        const rows = await conn.query("DELETE FROM scores WHERE user_id = ?", [user_id])
        return rows
    } catch (err) {
        throw err
    } finally {
        if (conn) conn.end()
    }
}

module.exports = {
    createUser,
    login,
    getHighScores,
    getUserHighScores,
    addScore,
    deleteScores
}