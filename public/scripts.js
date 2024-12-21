const userName = 'Nam'
const password = 'x'

const clientOptions = {
    query:{
        userName,password
    },
    auth:{
        userName,password
    }
}

const socket = io("http://localhost:3000", clientOptions);

const namespaceSockets = {}
let selectedNsId = 0

const listeners = {
    nsChange: {},
    messageToRoom: {},
}

const addListeners = (nsId) => {
    if(!listeners.messageToRoom.hasOwnProperty(nsId)) {
        namespaceSockets[nsId].on('nsChange', (namespace) => {
            console.log(namespace);
        })
        listeners.messageToRoom[nsId] = true;
    }

    if(!listeners.nsChange.hasOwnProperty(nsId)) {
        namespaceSockets[nsId].on('messageToRoom', (messageObj) => {
            console.log(messageObj);
            document.querySelector('#messages').innerHTML += buildMessageHtml(messageObj);
        })
        listeners.nsChange[nsId] = true;
    }
}

socket.on("connect", () => {
    console.log(`Client connected`);
    socket.emit('clientConnected');
})


socket.on("nsList", (nsData) => {
    const namespaceHtmlEle = document.querySelector(".namespaces")
    namespaceHtmlEle.innerHTML = ""
    nsData.forEach(ns => {
        namespaceHtmlEle.innerHTML += `<div class="namespace" namespaceId="${ns.id}" ns="${ns.endpoint}"><img src="${ns.image}"></div>`
        if(!namespaceSockets.hasOwnProperty(ns.id)){
            namespaceSockets[ns.id] = io(`http://localhost:3000${ns.endpoint}`);
        }
        addListeners(ns.id);
    })

    Array.from(document.getElementsByClassName('namespace')).forEach(element=>{
        element.addEventListener('click',e=>{
            joinNs(element.getAttribute('namespaceId'),nsData);
        })
    })

   const lastNsId =  localStorage.getItem('lastNsId')
    if(!lastNsId){
        joinNs(document.getElementsByClassName('namespace')[0].getAttribute('namespaceId'),nsData);
    }else{
        joinNs(lastNsId,nsData);
    }

})

document.querySelector('#message-form').addEventListener('submit',e=>{
    //keep the browser from submitting
    e.preventDefault();
    //grab the value from the input box
    const newMessage = document.querySelector('#user-message').value;
    namespaceSockets[selectedNsId].emit('newMessageToRoom',{
        newMessage,
        date: Date.now(),
        avatar: 'https://via.placeholder.com/30',
        userName,
        selectedNsId,
    })
    document.querySelector('#user-message').value = "";
})
