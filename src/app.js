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
const { readRoom, updateRoom } = require('./shared.js');
const isWinner = require('./game-logic.js');

io.on('connection', socket => {
  socket.on('join', room => {
    console.log(`[DEBUG] ${socket.id} joined room ${room._id}`);
    socket.join(room._id);
  });

  socket.on('leave', (room, username) => {
    console.log(`[DEBUG] ${socket.id} left room ${room._id}`);
    socket.leave(room._id);
    io.to(room._id).emit('stand', room, username);
  });

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

          await updateRoom(room._id, { players });

          io.to(room._id).emit('stand', room, username);
        }
      } catch (error) {
        console.log('[ERROR]', error.message);
      }
    }
  });

  socket.on('sit', (room, username) => {
    console.log(`[DEBUG] ${username} has sat down in room ${room._id}`);
    io.to(room._id).emit('sit', room, username);
  });

  socket.on('start', async room => {
    io.to(room._id).emit('start', room);
  });

  // OLD

  socket.on('server:draw', (player, room) => {
    io.emit('client:draw', player);
    io.to(socket.id).emit('client:drawCard', player.hand);
    io.to(socket.id).emit('client:incTurn', room);
  });

  socket.on('server:play', (space, player, room) => {
    // const playerIndex = room.players.findIndex(p => p._id === player._id);
    const spaceIndex = room.board.findIndex(s => s.value === space.value);
    // const max = findMax(space.value, player.hand);

    // if (space.hasPeg) {
    //   io.to(socket.id).emit('client:error', 'Space already has a peg.');
    //   io.to(socket.id).emit('client:resetTurn');
    // } else if (max === -1) {
    //   io.to(socket.id).emit('client:error', `You don't have a card to play there.`);
    //   io.to(socket.id).emit('client:resetTurn');
    // } else {
    //   console.log(`Player is playing ${max} in ${space.value}`);

    room.board[spaceIndex].hasPeg = true;
    room.board[spaceIndex].team = player.team;
    // player.hand = player.hand.filter(card => card.value !== max);
    // room.players[playerIndex].hand = player.hand;

    const max = 0;
    io.emit('client:playPeg', max, space.value, player, room);
    io.to(socket.id).emit('client:playCard', player.hand, room);

    if (isWinner(room.board, space.value)) {
      io.emit('client:winner', player.team);
      //save game to archive
    }
    // }
  });

  socket.on('server:reset', () => {
    io.emit('client:reset');
  });

  socket.on('server:restart', () => {
    io.emit('client:restart');
  });

  // socket.on('server:start', async room => {
  //   io.emit('client:start');

  //   for (let player of room.players) {
  //     io.to(player.socketID).emit('client:turn', room);
  //     io.to(player.socketID).emit('client:drawCard', player.hand);
  //   }
  // });

  socket.on('server:turn', room => {
    for (let player of room.players) {
      io.to(player.socketID).emit('client:turn', room);
    }
  });
});
