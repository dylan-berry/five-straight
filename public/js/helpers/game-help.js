import { updateRoom, readRoom } from './api-calls.js';

const id = window.location.search.slice(6);

const dealCards = async room => {
  for (let i = 0; i < 3; i++) {
    for (let player of room.players) {
      drawCard(room, player);
    }
  }

  await updateRoom(id, room);
  console.log('Dealing cards');
};

const drawCard = (room, player) => {
  const random = Math.floor(Math.random() * room.deck.length);
  player.hand.push(room.deck[random]);
  room.deck.splice(random, 1);
};

const restartGame = async () => {
  const data = await updateRoom(id, { restart: [] });
  socket.emit('restart');
};

const incrementTurn = async () => {
  const room = await readRoom(id);
  room.turn++;
  await updateRoom(id, { turn: room.turn });
  console.log(`Turn ${room.turn}`);
  socket.emit('turn', room);
};

export { dealCards, drawCard, restartGame, incrementTurn };
