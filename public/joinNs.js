const joinNs = (nsId, nsData) => {
    const nsClicked = nsData.find(ns => ns.id == nsId);
    selectedNsId = nsClicked.id
    const rooms = nsClicked.rooms

    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = '';
    let firstRoom
    rooms.forEach((room, idx) => {
        if (idx === 0) {
            firstRoom = room.title
        }
        roomList.innerHTML += `<li class="room" namespaceId=${room.namespaceId}>
          <span class="fa-solid fa-${room.isPrivateRoom ? 'lock' : 'globe'}"></span>${room.title}
        </li>`
    })
    joinRoom(firstRoom, nsClicked.id);


    const roomNodes = document.querySelectorAll('.room');
    Array.from(roomNodes).forEach((elem, idx)=>{
        elem.addEventListener('click',e=>{
            const namespaceId = elem.getAttribute('namespaceId')
            joinRoom(e.target.innerText, namespaceId)
        })
    })

    localStorage.setItem('lastNsId', nsClicked.id)
}
