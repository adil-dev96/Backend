import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { sendEmails } from "../services/mail.service.js";

export async function register(req,res) {

    const {username,email,password}=req.body
    

    const isUserAlreadyExist = await userModel.findOne({
        $or:[{email},{username}]
    })

    if(isUserAlreadyExist){
        return res.status(400).json({
            message:"user with this email or username is already exist",
            success:false,
            err:'user already exist'
        })
    }


    const user = await userModel.create({username,email,password})

    await sendEmails({
        to:email,
        subject:"Welcome to Perplexity",
        html:`
        <p>Hi ${username},</p>
        <p>Thank you for registering at <strong>Perplexity</strong>. We are exicited to have you on a borad!</p>
       
        `
    })

    res.status(201).json({
        message:'user registered successfully',
        sucess:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}