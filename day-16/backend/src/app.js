const express = require('express')
const cookiePareser = require('cookie-parser')
const authRouter = require('./routes/auth.route')


const app = express()
app.use(express.json())
app.use(cookiePareser())


app.use('/api/auth', authRouter)

module.exports = app