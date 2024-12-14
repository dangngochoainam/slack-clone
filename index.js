const express = require('express')
const {Server} = require("socket.io");

const namespaces = require("./data/namespaces");

const app = express()
app.use(express.static("./public"))
const expressServer = app.listen(3000)

const io = new Server(expressServer)
io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} has connected!`);
    socket.on('clientConnected', () => {
        socket.emit('nsList',namespaces)
    })
})
