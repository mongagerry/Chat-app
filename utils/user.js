let users = []

function addUser(username, room, id){
    let user = {
    username,
    room,
    id
}
    users.push(user)
    return user
}
function getUser(id){
    return users.find(user => user.id === id)
}

function userLeave(id){
    const index = users.findIndex((user) => user.id === id)
    if(index !== -1)
    return users.splice(index, 1)[0]
}

function getUserRoom(room){
    return users.filter((user) => user.room === room)
}
module.exports = {getUser, addUser, userLeave, getUserRoom} 