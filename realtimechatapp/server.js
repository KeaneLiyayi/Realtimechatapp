const { createServer } = require('http');
const { v4: uuidv4 } = require('uuid');
const { Server } = require('socket.io');
const httpServer = createServer();
const MessageStore = new (require('./src/lib/messageStore'))();
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    }
});
const sessionStore = new (require('./src/lib/sessionStore'))();

const users = [];

io.use((socket, next) => {
    const sessionId = socket.handshake.auth.sessionId;

    if (sessionId) {
        const session = sessionStore.findSession(sessionId);
        if (session) {
            socket.sessionId = sessionId;
            socket.id = session.userId;
            socket.email = session.email;
            return next();

        }




    }
    const username = socket.handshake.auth.email;

    if (!username) {
        return new Error("Bwana tafuta email bwana")
    }
    // Check if the user is already connected


    socket.userId = uuidv4()
    socket.sessionId = uuidv4()
    socket.email = username;
    next();
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Add the new user to the users array
    users.push({
        userId: socket.userId,
        username: socket.email
    });
    socket.emit("session", {
        sessionId: socket.sessionId,
        userId: socket.userId,
        email: socket.email,
    })

    socket.join(socket.userId)


    // Emit the updated list of users to all connected clients
    io.emit("users", users);

    // Notify other users of the new connection
    socket.broadcast.emit("user connected", {
        userId: socket.userId,
        username: socket.email,
    });

    socket.on("privateMessage", ({ message, to }) => {
        console.log("imefika", message)

        const messageToSave = {
            message,
            from: socket.email,
            to: to.email,
        }

        MessageStore.saveMessage(messageToSave)
        console.log(MessageStore.messages)
        socket.to(to.userId).to(socket.userId).emit("privateMessage", {
            message,
            from: socket.userId,


        })
    })


    socket.on('msg', ({ message, to }) => {
        socket.to(to.userId).emit('newmsg', { msg: "ahaaa" })

    })

    // Handle disconnection
    socket.on("disconnect", async () => {
        const matchingSockets = await io.in(socket.userId).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            // notify other users
            socket.broadcast.emit("user disconnected", socket.userID);
            // update the connection status of the session
            sessionStore.saveSession(socket.sessionID, {
                userId: socket.userId,
                username: socket.email,
                connected: false,
            });
        }
    });

    // Handle incoming messages
    socket.on('message', (msg) => {
        console.log(msg);
        broadcastMessage(msg);
    });
});

// Function to broadcast messages to all clients
const broadcastMessage = (message) => {
    io.emit('message', message);
};

httpServer.listen(5000, () => {
    console.log('Server is running on port 5000');
});
