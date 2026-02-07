const express = require('express')
const userModel = require('../models/user.model')

const authRouter= express.Router()
authRouter.post('/register', async (req,res)=>{
    const{email,password,name} = req.body



    const user = await userModel.create({
        email,password,name
    })

    res.status(201).json({
        message:'user registered',
        user
    })
})


module.exports = authRouter  