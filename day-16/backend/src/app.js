const express = require('express')
const cookiePareser = require('cookie-parser')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cookiePareser())
app.use(cors({
    credentials:true,
    origin:'http://localhost:5173'
}))

const authRouter = require('./routes/auth.route')
const postRouter = require('./routes/post.route')
const userRouter = require('./routes/user.route')


app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
app.use('/api/users' , userRouter)


module.exports = app