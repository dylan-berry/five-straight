import { readRoom, addPlayer, removePlayer, updateRoom } from './api-calls.js';
import { dealCards, drawCard, restartGame } from './game-help.js';

const id = window.location.search.slice(6);

const populateData = async () => {
  const room = await readRoom(id);

  for (let space of room.board) {
    document.querySelector('.game-board').innerHTML += `<div class="cell">${space.value}</div>`;
  }

  if (room.players.length > 0) {
    for (let player of room.players) {
      document.querySelector(`.player-${player.playerNum}`).textContent = player.username;
      document.querySelector(`.player-${player.playerNum}`).disabled = true;
      document.querySelector(`.player-${player.playerNum}`).setAttribute('id', `${player.socketID}`);
    }
  }
};

const handleBoardClick = async e => {
  const room = await readRoom(id);
  const spaceValue = Number(e.target.textContent);
  const player = room.players.filter(player => player.username === localStorage.getItem('username'))[0];
  const space = room.board.filter(space => space.value === spaceValue)[0];

  socket.emit('play', space, player, room);
};

const handleSitDown = async e => {
  const username = localStorage.getItem('username');
  const playerNum = e.target.classList[0].slice(7);
  const team = e.target.classList[1];
  const socketID = socket.id;

  localStorage.setItem('playerNum', playerNum);
  localStorage.setItem('team', team);

  const room = await addPlayer(id, username, playerNum, team, socketID);

  socket.emit('sit', room, username, playerNum, socketID);
};

const handleStandUp = async socketID => {
  const player = await removePlayer(id, socketID);
  return player;
};

const handleStart = async () => {
  const room = await readRoom(id);

  dealCards(room);

  socket.emit('start', room);
};

const updateTurnText = (turn, players) => {
  const p1 = players.filter(player => player.playerNum === 1)[0].username;
  const p2 = players.filter(player => player.playerNum === 2)[0].username;
  const p3 = players.filter(player => player.playerNum === 3)[0].username;
  const p4 = players.filter(player => player.playerNum === 4)[0].username;

  let player = null;

  if (turn % 4 === 0) {
    player = p4;
  } else if (turn % 4 === 3 || turn === 3) {
    player = p3;
  } else if (turn % 4 === 2 || turn === 2) {
    player = p2;
  } else {
    player = p1;
  }

  if (player === localStorage.getItem('username')) {
    document.querySelector('.turn-txt').textContent = 'Your turn';
  } else {
    document.querySelector('.turn-txt').textContent = `${player}'s turn`;
  }
};

const handleDraw = async () => {
  const room = await readRoom(id);
  const player = room.players.find(player => player.username === localStorage.getItem('username'));

  if (player.hand.length < 3) {
    drawCard(room, player);
    await updateRoom(id, room);

    socket.emit('draw', player);
  } else {
    console.log('You already have 3 cards.');
  }
};

const resetAll = async () => {
  const room = await readRoom(id);

  for (let player of room.players) {
    await removePlayer(id, player.socketID);
  }

  restartGame();
  socket.emit('reset');
};

export { populateData, handleBoardClick, handleSitDown, handleStandUp, handleStart, handleDraw, updateTurnText, resetAll };
