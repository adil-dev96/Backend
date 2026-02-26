const followModel = require('../model/follow.model')
const userModel = require('../model/user.model')

async function followUserController(req,res) {

    const followerUsername = req.user.username
    const followeeUsername = req.params.username

if(followeeUsername==followerUsername){
    return res.status(401).json({
        message:"You can not follow Yourself"
        
    })
}

const isAlreadyFollwing = await followModel.findOne({
    followee:followeeUsername,
    follower:followerUsername
})

const isFolloweeExist = await userModel.findOne({
    username:followeeUsername
})

if(!isFolloweeExist){
    return res.status(404).json({
        message:"user you are trying to follow does not access"
    })
}

if(isAlreadyFollwing){
    return res.status(200).json({
        message:`You are already following ${followeeUsername}`,
        follow:isAlreadyFollwing
    })
}

    const followRecord  = await followModel.create({
        follower:followerUsername,
        followee:followeeUsername
    })
    
    res.status(201).json({
        message:`you are now following ${followeeUsername}`,
        follow:followRecord
    })
}

async function unfollowUserController(req,res){
    const followerUsername = req.user.username
    const followeeUsername = req.params.username


    const isUserFollowing = await followModel.findOne({
    follower:followerUsername,
    followee:followeeUsername
})

if(!isUserFollowing){
    return res.status(200).json({
        message:`You are not following ${followeeUsername}`
    })
}

await followModel.findByIdAndDelete(isUserFollowing._id)

res.status(200).json({
    message:`you have unfolowed user ${followeeUsername}`
})

}


module.exports = {
    followUserController,
    unfollowUserController
}