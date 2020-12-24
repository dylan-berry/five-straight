import { updateRoom } from './helpers/api-calls.js';
import { incrementTurn, restartGame } from './helpers/game-help.js';
import { populateData, handleBoardClick, handleSitDown, handleStandUp, handleStart, handleDraw, updateTurnText, resetAll } from './helpers/room-help.js';

const usernameForm = document.querySelector('.username-form');
const seats = document.querySelector('.seats');
const gameBoard = document.querySelector('.game-board');
const startBtn = document.querySelector('.start-btn');
const drawBtn = document.querySelector('.draw-btn');
const restartBtn = document.querySelector('.restart-btn');
const playerHand = document.querySelector('.cards-grid');

populateData();

if (localStorage.getItem('username')) {
  usernameForm.innerHTML = `<h2 class="text-left">Hi, ${localStorage.getItem('username')}</h2>`;
} else {
  usernameForm.innerHTML = `
    <label for="username">Name:</label>
    <input class="username-input" type="text" name="username" />
    <button class="ok-btn">OK</button>
  `;
}

usernameForm.addEventListener('submit', e => {
  e.preventDefault();
  localStorage.setItem('username', document.querySelector('.username-input').value);
  usernameForm.innerHTML = `<h2>Welcome, ${localStorage.getItem('username')}</h2>`;
});

// Click handlers
document.querySelector('.reset-btn').addEventListener('click', () => {
  resetAll();
});

seats.addEventListener('click', e => {
  if (e.target.classList.contains('sit-btn') && e.target.textContent == 'Sit Down') {
    handleSitDown(e);
  }
});

gameBoard.addEventListener('click', e => {
  if (e.target.classList.contains('cell')) {
    handleBoardClick(e);
  }
});

startBtn.addEventListener('click', () => {
  handleStart();
});

drawBtn.addEventListener('click', () => {
  handleDraw();
});

restartBtn.addEventListener('click', () => {
  restartGame();
});

// Sockets
socket.on('sit', (room, username, playerNum, socketID) => {
  document.querySelector(`.player-${playerNum}`).textContent = username;
  document.querySelector(`.player-${playerNum}`).disabled = true;
  document.querySelector(`.player-${playerNum}`).setAttribute('id', socketID);
  console.log(`${username} sat down as Player ${playerNum}`);

  if (room.players.length >= 4) {
    startBtn.disabled = false;
  }
});

socket.on('sit disable', () => {
  for (let btn of document.querySelectorAll('.sit-btn')) {
    if (btn.textContent === 'Sit Down') {
      btn.disabled = true;
    }
  }
});

socket.on('stand', async socketID => {
  const player = await handleStandUp(socketID);
  console.log(`${player.username} has left the game`);
  document.querySelector(`#${socketID}`).textContent = 'Sit Down';
  document.querySelector(`#${socketID}`).disabled = false;
  document.querySelector(`#${socketID}`).removeAttribute('id');
});

socket.on('start', () => {
  startBtn.style.display = 'none';
  drawBtn.style.display = 'inline-block';
  seats.style.display = 'none';
  playerHand.style.display = 'grid';
});

socket.on('restart', () => {
  startBtn.style.display = 'inline-block';
  drawBtn.style.display = 'none';
  seats.style.display = 'block';
  playerHand.style.display = 'none';

  document.querySelector('.turn-txt').textContent = 'Waiting for game to begin';
  startBtn.disabled = false;
  restartBtn.disabled = true;

  for (let space of gameBoard.children) {
    space.classList.remove('orange');
    space.classList.remove('teal');
  }
});

socket.on('reset', () => {
  for (let btn of document.querySelectorAll('.sit-btn')) {
    btn.textContent = 'Sit Down';
    btn.disabled = false;
    btn.removeAttribute('id');
  }
});

socket.on('playPeg', (cardPlayed, spaceValue, player) => {
  for (let space of gameBoard.children) {
    if (Number(space.textContent) === spaceValue) {
      space.classList.add(player.team);
      break;
    }
  }

  incrementTurn();
  console.log(`${player.username} played ${cardPlayed} in ${spaceValue}.`);
});

socket.on('playCard', (hand, room) => {
  playerHand.innerHTML = '';
  for (let card of hand) {
    playerHand.innerHTML += `<div class="card-cell">${card.value}</div>`;
  }
  updateRoom(room._id, { players: room.players, board: room.board });
});

socket.on('turn', (turn, players) => {
  updateTurnText(turn, players);
});

socket.on('drawCard', hand => {
  playerHand.innerHTML = '';
  for (let card of hand) {
    playerHand.innerHTML += `<div class="card-cell">${card.value}</div>`;
  }
});

socket.on('draw', player => {
  incrementTurn();
  console.log(`${player.username} drew a card.`);
});

socket.on('error', msg => {
  console.log(msg);
});

socket.on('winner', () => {
  console.log('Winner, winner, chicken dinner.');
});
