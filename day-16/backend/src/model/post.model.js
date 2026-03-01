const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    imageUrl:{
        type:String,
        required:[true,"imgUrl is requird to create a post"]
    },
    user:{
        
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:[true, "userId is required to crerate a post"]
    }
},)


const postModel = mongoose.model('posts', postSchema)

module.exports  = postModel