
async function addUser(User, username, room, id){
    let user = new User({
    username,
    room,
    id
})
    await user.save()
    return user
}
async function getUser(User, ref_id){
    let user = await User.findOne({id: ref_id})
    return user 
}
async function userLeave(User, ref_id){
    return await User.findOneAndDelete({id:ref_id})
}

async function getUserRoom(User, ref_room){
    return await User.find({room: ref_room})
}
module.exports = {getUser, addUser, userLeave, getUserRoom} 