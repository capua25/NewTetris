const express = require('express')
const routes = require('./routes/routes.js')

const app = express()
const port = 3060

app.use(express.json())

app.use('/', routes)

app.listen(port, () => {
    console.log(`Server Listening on ${port}`)
})