class MessageStore {
    constructor() {
        this.messages = [];
    }

    saveMessage(message) {
        this.messages.push(message)
    }

    findMessageForUser(user) {
        return this.messages.filter(msg => msg.from === user || msg.to === user)
    }




}

module.exports = MessageStore