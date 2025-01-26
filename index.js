// import path from 'path'
// import express from 'express'
// import  url from 'url'
// import http from 'http'
// import socketio from 'socket.io'

const path = require('path')
const express = require('express')
const url = require('url')
const http = require('http')
const socketio = require('socket.io')

// const __filename = url.fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000

io.on('connection', () =>{
    console.log("A new WS connection")
})

app.listen(PORT, () =>{
    console.log("Server running on 3000")
})