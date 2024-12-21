const express = require('express')
const Room = require('./classes/Room')
const {Server} = require("socket.io");

const namespaces = require("./data/namespaces");

const app = express()
app.use(express.static("./public"))
const expressServer = app.listen(3000)

app.get('/change-ns',(req, res)=>{
    //update namespaces array
    namespaces[0].addRoom(new Room(0,'Deleted Articles',0))
    //let everyone know in THIS namespace, that it changed
    io.of(namespaces[0].endpoint).emit('nsChange',namespaces[0]);
    res.json(namespaces[0]);
})

const io = new Server(expressServer)

io.use((socket,next)=>{
    const handshake = socket.handshake;
    // authentication with client options
    if(handshake){
        next()
    }else{
        console.log("Goodbye")
        socket.disconnect()
    }
})

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} has connected!`);
    socket.on('clientConnected', () => {
        socket.emit('nsList',namespaces)
    })
})

namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connection', (socket) => {
        socket.on('joinRoom', async(roomObj, ackCb) => {
            const ns = namespaces[roomObj.namespaceId]
            const room = ns.rooms.find(room => room.title === roomObj.title)

            const rooms = socket.rooms
            let i = 0;
            rooms.forEach(room=>{
                //we don't want to leave the socket's personal room which is guaranteed to be first
                if(i!==0){
                    socket.leave(room);
                }
                i++;
            })
            socket.join(room.title)

            const sockets = await io.of(ns.endpoint).in(room.title).fetchSockets();

            ackCb({
                totalUser: sockets.length,
                thisRoomsHistory: room.history
            })
        })

        socket.on('newMessageToRoom', (messageObj) => {
            const rooms = socket.rooms;
            const currentRoom = [...rooms][1]; //this is a set!! Not array
            io.of(namespace.endpoint).in(currentRoom).emit('messageToRoom',messageObj)

            const ns = namespaces[messageObj.selectedNsId];
            const room = ns.rooms.find(room=>room.title === currentRoom);
            room.addMessage(messageObj);
        })
    })
})
