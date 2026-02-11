const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:String,
    email:{
        type: String,
        unique:[true,"with this email account is already exist"]

    },
    password:String
})

const userModel = mongoose.model('users',userSchema)


module.exports = userModel