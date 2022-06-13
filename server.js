const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

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


server.listen(port, () => {
    console.log(`Server running on ${port}`);
})