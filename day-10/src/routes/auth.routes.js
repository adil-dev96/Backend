const express = require('express')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const authRouter= express.Router()





authRouter.post('/register', async (req,res)=>{
    const{email,password,name} = req.body

const isUserAlreadyExist = await userModel.findOne({email})

if (isUserAlreadyExist){
    return res.status(409).json({
        message:'user already exist with this email address'
    })
}

    const user = await userModel.create({
        email,password,name
    })


    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET
    )

res.cookie('jwt_token', token)

    res.status(201).json({
        message:'user registered',
        user,
        token
    })
})


module.exports = authRouter  