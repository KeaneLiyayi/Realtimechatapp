class inMemorySessionStore {
    constructor() {
        this.sessions = new Map()
    }
    findSession(id) {
        return this.sessions.get(id);
    }

    saveSession(id, session) {
        this.sessions.set(id, session);
    }

    findAllSessions() {
        return [...this.sessions.values()];
    }


}
module.exports = inMemorySessionStore