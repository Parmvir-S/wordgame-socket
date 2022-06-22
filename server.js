const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
      }
});

app.get("/", (req, res) => {
    res.write("Hello");
    res.end();
})

const users = [];

function getRoomUsers(room) {
    let people = [];
    for (let i = 0; i < users.length; i++) {
        if (users[i].room === room) {
            people.push(users[i]);
        }
    }
    return people;
}

io.on("connection", (socket) => {
    // console.log("Connection was established by", socket.id);

    socket.on("join-room", ({name, room}) => {
        users.push({name, websocketid: socket.id, room})
        socket.join(room);
        console.log(`${name} has joined the ${room} chat`)
        io.to(room).emit("roomUsers", {
            roomUsers: getRoomUsers(room)
        })
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
        let index = -1;
        let room = "";
        for (let i = 0; i < users.length; i++) {
            if (users[i].websocketid === socket.id) {
                index = i;
                room = users[i].room;
            }
        }
        if (index != -1) {
            users.splice(index, 1);
        }
        io.to(room).emit("roomUsers", {
            roomUsers: getRoomUsers(room)
        })
        console.log("Disconnected", socket.id)
    })
})


server.listen(port, () => {
    console.log(`Server running on ${port}`);
})