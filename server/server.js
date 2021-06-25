"use strict";

// importing essentials
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

// configuring express
const app = express();

// configuring http server and socket.io
const server = http.createServer(app);
const io = socketio(server);

// setting port number
const port = process.env.PORT || 3000;

// to track users
const users = {};

// initializing socket.io connection
// this will recognize our clients
io.on("connection", (socket) => {
  // alert when any new client connects
  // console.log("New websocket connection!");

  // listening to "hello" event, emitted by client
  socket.on("hello", (username) => {
    users[socket.id] = username;
    // console.log(socket.id);
    // console.log(users);
    // console.log(`Total users: ${users.length}`);
    socket.broadcast.emit("announce", `${username} joined!`);
  });

  socket.on("data-chunk", (chunk) => {
    socket.broadcast.emit("data-chunk-rec", chunk);
  });

  socket.on("stream-end", (info) => {
    socket.broadcast.emit("stream-end-rec", info);
  });

  socket.on("disconnect", () => {
    const userDisconnected = users[socket.id];
    delete users[socket.id];
    // console.log(`${userDisconnected} disconnected!`);
    // console.log("Total users: ");
    // console.log(users);
  });
});

server.listen(port, () => {
  // console.log(`Server is up on port ${port}!`);
});
