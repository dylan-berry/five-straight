require('dotenv').config();

const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const fetch = require('node-fetch');

require('./db/mongoose');
const room = require('./routes/room');
const user = require('./routes/user');

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

// Express
const app = express();
app.use(express.static(publicDirectoryPath));
app.use(express.json());

// Routes
app.use('/rooms', room);
app.use('/users', user);

// Start server
const server = app.listen(port, () => {
  console.log(`Server up on port ${port}.`);
});

// Sockets
const io = socketIO(server);
const { findMax } = require('./game-logic');

io.on('connection', socket => {
  console.log(`User ${socket.id} connected`);

  socket.on('disconnect', async () => {
    console.log(`User ${socket.id} disconnected`);
    const roomId = socket.request.headers.referer.split('room=')[1];
    const host = socket.request.headers.referer.split('/room')[0];
    const url = `${host}/rooms/player/${roomId}`;
    const json = JSON.stringify({ socketID: socket.id });

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json
    });

    const data = await res.json();

    io.emit('client:stand', data);
  });

  socket.on('server:draw', (player, room) => {
    io.emit('client:draw', player);
    io.to(socket.id).emit('client:drawCard', player.hand);
    io.to(socket.id).emit('client:incTurn', room);
  });

  socket.on('server:play', (space, player, room) => {
    const playerIndex = room.players.findIndex(p => p._id === player._id);
    const spaceIndex = room.board.findIndex(s => s.value === space.value);
    const max = findMax(space.value, player.hand);

    if (space.hasPeg) {
      io.to(socket.id).emit('client:error', 'Space already has a peg.');
      io.to(socket.id).emit('client:resetTurn');
    } else if (max === -1) {
      io.to(socket.id).emit('client:error', `You don't have a card to play there.`);
      io.to(socket.id).emit('client:resetTurn');
    } else {
      console.log(`Player is playing ${max} in ${space.value}`);

      room.board[spaceIndex].hasPeg = true;
      room.board[spaceIndex].team = player.team;
      player.hand = player.hand.filter(card => card.value !== max);
      room.players[playerIndex].hand = player.hand;

      io.emit('client:playPeg', max, space.value, player, room);
      io.to(socket.id).emit('client:playCard', player.hand, room);
    }
  });

  socket.on('server:reset', () => {
    io.emit('client:reset');
  });

  socket.on('server:restart', () => {
    io.emit('client:restart');
  });

  socket.on('server:sit', async (room, username, playerNum, socketID) => {
    console.log(`${username} has sat down at table ${room._id}`);
    io.emit('client:sit', room, username, playerNum, socketID);
    io.to(socket.id).emit('client:sit disable');
  });

  socket.on('server:start', async room => {
    io.emit('client:start');

    for (let player of room.players) {
      io.to(player.socketID).emit('client:turn', room);
      io.to(player.socketID).emit('client:drawCard', player.hand);
    }
  });

  socket.on('server:turn', room => {
    for (let player of room.players) {
      io.to(player.socketID).emit('client:turn', room);
    }
  });
});
