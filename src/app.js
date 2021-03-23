require('dotenv').config();

const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const history = require('connect-history-api-fallback');

require('./db/mongoose');
const rooms = require('./routes/rooms.js');

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../dist');

// Express
const app = express();
app.use(express.json());

// Routes
app.use('/rooms', rooms);

app.use(history());
app.use(express.static(publicDirectoryPath));

// Start server
const server = app.listen(port, () => {
  console.log(`Server up on port ${port}.`);
});

// Socket.IO
const io = socketIO(server);
const { readRoom, updateRoom } = require('./api-calls.js');
const isWinner = require('./game-logic.js');

io.on('connection', socket => {
  // User joins a room
  socket.on('join', room => {
    console.log(`[DEBUG] ${socket.id} joined room ${room._id}`);
    socket.join(room._id);
  });

  // User leaves room by navigating away (on component unmount)
  socket.on('leave', (room, username) => {
    console.log(`[DEBUG] ${socket.id} left room ${room._id}`);
    socket.leave(room._id);
    io.to(room._id).emit('stand', room, username);
  });

  // User leaves room by closing/refreshing
  socket.on('disconnect', async () => {
    const url = socket.request.headers.referer.split('/');
    const id = url[url.length - 1];
    console.log(`[DEBUG] ${socket.id} left room ${id}`);

    if (id) {
      try {
        const room = await readRoom(id);
        socket.leave(room._id);

        const player = room.players.find(player => player.socketID === socket.id);

        if (player) {
          const username = player.username;
          const players = room.players.filter(player => player.username !== username);

          room.seats.forEach((seat, i) => {
            if (seat.text === username) {
              room.seats[i] = { text: 'Sit Down', team: seat.team };
            }
          });

          await updateRoom(room._id, { players, seats: room.seats });

          io.to(room._id).emit('stand', room, username);
        }
      } catch (error) {
        console.log('[ERROR]', error.message);
      }
    }
  });

  // User sits down at game
  socket.on('sit', (room, username) => {
    console.log(`[DEBUG] ${username} has sat down in room ${room._id}`);
    io.to(room._id).emit('sit', room, username);
  });

  // 'Start Game' button is clicked
  socket.on('start', room => {
    io.to(room._id).emit('start', room);
  });

  // User plays a peg in a valid space
  socket.on('play', (card, space, player, room) => {
    console.log(`[DEBUG] ${player} played ${card} in ${space}`);
    io.to(room._id).emit('play', card, space, player, room);
  });

  socket.on('draw', (room, player) => {
    console.log(`[DEBUG] ${player} drew card`);
    io.to(room._id).emit('draw', room, player);
  });
});
