const express = require("express");
const http = require("http");
const app = express();
const socketio = require("socket.io");

const server = http.createServer(app);
const port = process.env.PORT || 3000;
const io = socketio(server);

const botName = "KittyChat bot";
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const clientPath = `${__dirname}/./client`;
app.use(express.static(clientPath));

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("joinRoom", ({ username, chatroom }) => {
    const user = userJoin(socket.id, username, chatroom);

    socket.join(user.chatroom);
    console.log(user.chatroom);

    // Emit sends message to everybody when client connects
    socket.emit(
      "message",
      formatMessage(
        "",
        botName,
        `😻 Hi ${user.username}, welcome to KittyChat - ${user.chatroom}! 😻`
      )
    );

    // Send message when user connects, to everybody except client
    socket.broadcast
      .to(user.chatroom)
      .emit(
        "message",
        formatMessage("", botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.chatroom).emit("roomUsers", {
      chatroom: user.chatroom,
      users: getRoomUsers(user.chatroom),
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.chatroom).emit(
          "message",
          formatMessage("", botName, `${user.username} has left the chat`)
        );

        // Send users and room info
        io.to(user.chatroom).emit("roomUsers", {
          room: user.chatroom,
          users: getRoomUsers(user.chatroom),
        });
      }
    });
  });

  // Send message to everybody
  socket.on("sendToAll", (message) => {
    const user = getCurrentUser(socket.id);

    io.emit("message", formatMessage(user.id, user.username, message));
  });

  // Send message only to me
  socket.on("sendToMe", (message) => {
    const user = getCurrentUser(socket.id);

    socket.emit("message", formatMessage(user.id, user.username, message));
  });
});

server.listen(port, () => {
  console.log(`server running on ${port}`);
});
