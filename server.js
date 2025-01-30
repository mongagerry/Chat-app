// import path from 'path'
// import express from 'express'
// import  url from 'url'
// import http from 'http'
// import socketio from 'socket.io'

const sanitizeUserInput = require('./utils/sanitise.js')
const createobj = require('./utils/userobject')
const path = require('path')
const express = require('express')
const url = require('url')
const http = require('http')
const socketio = require('socket.io')
const {getUser , addUser, userLeave, getUserRoom} = require("./utils/user")
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const bot = 'ChatBot'

app.use(express.static(path.join(__dirname, 'public')))

const uri = "mongodb://127.0.0.1:27017/chat_database"; // Replace with your DB name

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() =>{
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));

const userSchema = new mongoose.Schema({
  username: String,
  room: String,
  id: String,
});

const User = mongoose.model("User", userSchema, "users_collection");

// const __filename = url.fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

io.on('connection', async socket => {
    
    
    socket.on('JoinRoom', async (username, room) =>{
    const user = await addUser(User, username, room, socket.id)
    socket.join(user.room)
    socket.emit('message', createobj(bot, 'You have joined!'))
    socket.broadcast.to(user.room).emit('message', createobj(bot, `User ${user.username} has joined!`))
    io.to(user.room).emit('userRoom', {
        room: user.room,
        users: await getUserRoom(User, user.room)})
    })
    
    socket.on('chatMessage', async (msg) =>{
        msg = sanitizeUserInput(msg)
        let user = await getUser(User, socket.id)
        io.to(user.room).emit('message', createobj(user.username,msg))
    })

    socket.on('disconnect', async () =>{
        let user = await userLeave(User, socket.id)
        if(user){
        io.to(user.room).emit('message', createobj(bot, `User ${user.username} has left!`))
        
        io.to(user.room).emit('userRoom', {
            room: user.room,
            users: await getUserRoom(User, user.room)})
        }
    })
})

server.listen(PORT,'0.0.0.0', () =>{
    console.log("Server running on 3000")
})

})

