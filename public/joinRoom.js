const joinRoom = async (title, namespaceId) => {
    const ackResp = await namespaceSockets[namespaceId].emitWithAck('joinRoom', {title, namespaceId});
    document.querySelector('.curr-room-num-users').innerHTML = `${ackResp.totalUser}<span class="fa-solid fa-user"></span>`
    document.querySelector('.curr-room-text').innerHTML = title;

    document.querySelector('#messages').innerHTML = "";

    ackResp.thisRoomsHistory.forEach(message=>{
        document.querySelector('#messages').innerHTML += buildMessageHtml(message)
    })
}
