const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const { SocketAddress } = require("net");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
      }
});

io.on("connection", (socket) => {
    // console.log("Connection was established by", socket.id);

    socket.on("join-room", ({name, room}) => {
        socket.join(room);
        console.log(`${name} has joined the ${room} chat`)
    })

    socket.on("letter", ({tempLetter, room}) => {
        io.to(room).emit("recieved-letter", tempLetter);
    })

    socket.on("send-time", ({room, timeArg}) => {
        io.to(room).emit("recieved-time", timeArg);
    })

    socket.on("send-questions", ({topics, room}) => {
        io.to(room).emit("recieved-topics", topics)
    })

    socket.on("disconnect", () => {
        console.log("Disconnected", socket.id)
    })
})

const PORT = 8000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})