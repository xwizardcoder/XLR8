import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join_chat", (username) => {
    socket.username = username;

    io.emit("user_joined", {
      username,
    });
  });

  socket.on("send_message", (message) => {
    io.emit("receive_message", {
      username: socket.username,
      message,
      socketId: socket.id,
    });
  });

  socket.on("typing", () => {
    socket.broadcast.emit("user_typing", {
      username: socket.username,
    });
  });

  socket.on("stop_typing", () => {
    socket.broadcast.emit("user_stop_typing", {
      username: socket.username,
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    if (socket.username) {
      io.emit("user_left", {
        username: socket.username,
      });
    }
  });
});

app.get("/", (req, res) => {
  res.send("XLR8 server is running");
});

server.listen(8000, () => {
  console.log("XLR8 server running on port 8000");
});