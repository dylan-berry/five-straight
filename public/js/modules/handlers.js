import { readRoom, removePlayer, updateRoom } from './api-calls.js';
import { dealCards } from './game-help.js';

const id = window.location.search.slice(6);

// Click 'Reset' button
const handleReset = async () => {
  const room = await readRoom(id);

  for (let player of room.players) {
    await removePlayer(id, player.socketID);
  }

  handleRestart();
  socket.emit('server:reset');
};

const handleRestart = async () => {
  await updateRoom(id, { restart: [] });
  socket.emit('server:restart');
};

export { handleBoardClick, handleDraw, handleForm, handleReset, handleRestart, handleSettings, handleSitDown, handleStart };
