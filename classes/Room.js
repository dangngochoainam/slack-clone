class Room {
    constructor(id, title, namespaceId, isPrivateRoom = false) {
        this.id = id;
        this.title = title;
        this.namespaceId = namespaceId;
        this.isPrivateRoom = isPrivateRoom;
        this.history = []
    }

    addMessage(messageObj){
        this.history.push(messageObj);
    }

    clearHistory(){
        this.history = [];
    }
}

module.exports = Room
