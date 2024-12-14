const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log(`Client connected`);
    socket.emit('clientConnected');
})

socket.on("nsList", (nsList) => {
    console.log(nsList);
})
