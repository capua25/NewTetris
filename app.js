const express = require('express')
const routes = require('./routes/routes.js')
const scores = require('./routes/scores.js')
const CORS = require('cors')

const app = express()
const port = 3060

app.use(CORS())
app.use(express.json())

app.use('/', routes)
app.use('/scores', scores)

app.listen(port, () => {
    console.log(`Server Listening on ${port}`)
})