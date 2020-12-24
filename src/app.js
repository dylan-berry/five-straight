require('dotenv').config();

const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

require('./db/mongoose');
const room = require('./routes/room');
const user = require('./routes/user');

const { findMax } = require('./game-logic');

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

// Express
const app = express();
app.use(express.static(publicDirectoryPath));
app.use(express.json());

// Routes
app.use('/rooms', room);
app.use('/users', user);

const server = app.listen(port, () => {
  console.log(`Server up on port ${port}.`);
});

const io = socketIO(server);

io.on('connection', socket => {
  console.log(`User ${socket.id} connected`);

  socket.on('sit', async (room, username, playerNum, socketID) => {
    console.log(`${username} has sat down at table ${room._id}`);
    io.emit('sit', room, username, playerNum, socketID);
    io.to(socket.id).emit('sit disable');
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
    io.emit('stand', socket.id);
  });

  socket.on('reset', () => {
    io.emit('reset');
  });

  socket.on('play', (space, player, room) => {
    const playerIndex = room.players.findIndex(p => p._id === player._id);
    const spaceIndex = room.board.findIndex(s => s.value === space.value);
    const max = findMax(space.value, player.hand);

    if (space.hasPeg) {
      io.to(socket.id).emit('error', 'Space already has a peg.');
    } else if (max === -1) {
      io.to(socket.id).emit('error', `You don't have a card to play there.`);
    } else {
      console.log(`Player is playing ${max} in ${space.value}`);

      room.board[spaceIndex].hasPeg = true;
      room.board[spaceIndex].team = player.team;
      player.hand = player.hand.filter(card => card.value !== max);
      room.players[playerIndex].hand = player.hand;

      io.emit('playPeg', max, space.value, player);
      io.to(socket.id).emit('playCard', player.hand, room);
    }
  });

  socket.on('start', room => {
    console.log('Game has started');

    io.emit('start');

    for (let player of room.players) {
      io.to(player.socketID).emit('turn', room.turn, room.players);
      io.to(player.socketID).emit('drawCard', player.hand);
    }
  });

  socket.on('draw', player => {
    io.emit('draw', player);
    io.to(socket.id).emit('drawCard', player.hand);
  });

  socket.on('turn', room => {
    for (let player of room.players) {
      io.to(player.socketID).emit('turn', room.turn, room.players);
    }
  });

  socket.on('restart', () => {
    io.emit('restart');
  });
});
