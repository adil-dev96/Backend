const express = require('express')
const UserController = require('../controllers/user.controller')
const identifyUser = require('../middlewares/auth.middlewares')


const userRouter = express.Router()


userRouter.post('/follow/:username',identifyUser,UserController.followUserController)

userRouter.post('/unfollow/:username', identifyUser, UserController.unfollowUserController)

module.exports = userRouter