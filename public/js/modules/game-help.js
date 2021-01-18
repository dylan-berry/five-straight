import { updateRoom, readRoom } from './api-calls.js';

const id = window.location.search.slice(6);

const dealCards = async room => {
  for (let i = 0; i < 3; i++) {
    for (let player of room.players) {
      drawCard(room, player);
    }
  }

  await updateRoom(id, room);
};

const drawCard = (room, player) => {
  const random = Math.floor(Math.random() * room.deck.length);
  player.hand.push(room.deck[random]);
  room.deck.splice(random, 1);
};

const incrementTurn = async room => {
  room.turn++;

  if (room.turn % 4 === 0) {
    room.turnOwner = room.players.find(player => player.playerNum === 4).username;
  } else if (room.turn % 4 === 3) {
    room.turnOwner = room.players.find(player => player.playerNum === 3).username;
  } else if (room.turn % 4 === 2) {
    room.turnOwner = room.players.find(player => player.playerNum === 2).username;
  } else {
    room.turnOwner = room.players.find(player => player.playerNum === 1).username;
  }

  await updateRoom(id, room);

  socket.emit('server:turn', room);
};

export { dealCards, drawCard, incrementTurn };
