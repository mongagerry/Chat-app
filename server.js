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

// const __filename = url.fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const bot = 'ChatBot'
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {

     
    socket.on('JoinRoom', (username, room) =>{
    const user = addUser(username, room, socket.id)
    socket.join(user.room)
    socket.emit('message', createobj(bot, 'You have joined'))
    socket.broadcast.to(user.room).emit('message', createobj(bot, `User ${user.username} has joined`))
    io.to(user.room).emit('userRoom', {
        room: user.room,
        users: getUserRoom(user.room)})
    })
    
    socket.on('chatMessage', (msg) =>{
        msg = sanitizeUserInput(msg)
        let user = getUser(socket.id)
        io.to(user.room).emit('message', createobj(user.username,msg))
    })

    socket.on('disconnect', () =>{
        let user = userLeave(socket.id)
        if(user){
        io.to(user.room).emit('message', createobj(bot, `User ${user.username} has left`))
        
        io.to(user.room).emit('userRoom', {
            room: user.room,
            users: getUserRoom(user.room)})
        }
    })
}) 

server.listen(PORT,'0.0.0.0', () =>{
    console.log("Server running on 3000")
})