const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const app = express();
const cors = require("cors");

const server = createServer(app);
const io = new Server(server, {
  //here io refers to the circuit
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// app.use(
//   cors({
//     origin: "http://localhost:5173/",
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );
app.get("/", (req, res) => {
  res.send("Server is live");
});

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);
  // console.log("Id", socket.id);
  // socket.emit("welcome", `Welcome to the Socket Server: ${socket.id}`);
  // socket.broadcast.emit("broadcast", `${socket.id} joined the server`);
  socket.on("message", ({ room, message }) => {
    console.log("Data", { room, message });
    // socket.broadcast.emit("received-message", data);
    io.to(room).emit("received-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnect", socket.id);
  });
});

server.listen(8080, (req, res) => {
  console.log("🚀 started on 8080");
});
