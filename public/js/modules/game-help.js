import { updateRoom } from './api-calls.js';

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
