import { updateRoom } from './modules/api-calls.js';
import { incrementTurn } from './modules/game-help.js';
import { populateData, updateTurnText } from './modules/room-help.js';
import { handleBoardClick, handleDraw, handleForm, handleReset, handleRestart, handleSettings, handleSitDown, handleStart } from './modules/handlers.js';

const chat = document.querySelector('.chat');
const drawBtn = document.querySelector('.draw-btn');
const gameBoard = document.querySelector('.game-board');
const log = document.querySelector('.log');
const playerHand = document.querySelector('.cards-grid');
const seats = document.querySelector('.seats');
const settingsBtn = document.querySelector('.settings-btn');
const startBtn = document.querySelector('.start-btn');
const restartBtn = document.querySelector('.restart-btn');
const resetBtn = document.querySelector('.reset-btn');
const usernameForm = document.querySelector('.username-form');

populateData();

// Event listeners
drawBtn.addEventListener('click', () => {
  handleDraw();
});

gameBoard.addEventListener('click', e => {
  if (e.target.classList.contains('cell')) {
    handleBoardClick(e);
  }
});

resetBtn.addEventListener('click', () => {
  handleReset();
});

restartBtn.addEventListener('click', () => {
  handleRestart();
});

seats.addEventListener('click', e => {
  if (e.target.classList.contains('sit-btn') && e.target.textContent == 'Sit Down') {
    handleSitDown(e);
  }
});

settingsBtn.addEventListener('click', () => {
  handleSettings();
});

startBtn.addEventListener('click', () => {
  handleStart();
});

usernameForm.addEventListener('submit', e => {
  e.preventDefault();
  handleForm();
});

// Sockets
// Individual event
socket.on('client:drawCard', hand => {
  playerHand.innerHTML = '';
  for (let card of hand) {
    playerHand.innerHTML += `<div class="card-cell">${card.value}</div>`;
  }
});

socket.on('client:draw', player => {
  chat.innerHTML += `<p class="chat-action">${player.username} drew a card.</p>`;
  chat.scrollIntoView(false);
  log.innerHTML = `<p class="chat-action">${player.username} drew a card.</p>`;
});

socket.on('client:error', msg => {
  chat.innerHTML += `<p class="chat-action text-danger">${msg}</p>`;
  chat.scrollIntoView(false);
  log.innerHTML = `<p class="chat-action text-danger">${msg}</p>`;
});

socket.on('client:incTurn', room => {
  incrementTurn(room);
});

// Individual event
socket.on('client:playCard', async (hand, room) => {
  playerHand.innerHTML = '';
  for (let card of hand) {
    playerHand.innerHTML += `<div class="card-cell">${card.value}</div>`;
  }

  room = await updateRoom(room._id, { players: room.players, board: room.board });
  incrementTurn(room);
});

// Group event
socket.on('client:playPeg', (cardPlayed, spaceValue, player, room) => {
  const lastPlayed = document.querySelector('.last-played');
  if (lastPlayed) {
    lastPlayed.classList.remove('last-played');
  }

  for (let space of gameBoard.children) {
    if (Number(space.textContent) === spaceValue) {
      space.classList.add(player.team, 'last-played');
      break;
    }
  }

  chat.innerHTML += `<p class="chat-action">${player.username} played ${cardPlayed} in ${spaceValue}.</p>`;
  chat.scrollIntoView(false);
  log.innerHTML = `<p class="chat-action">${player.username} played ${cardPlayed} in ${spaceValue}.</p>`;
});

socket.on('client:reset', () => {
  startBtn.disabled = true;

  for (let btn of document.querySelectorAll('.sit-btn')) {
    btn.textContent = 'Sit Down';
    btn.disabled = false;
    btn.removeAttribute('id');
  }
});

socket.on('client:resetTurn', () => {
  localStorage.setItem('turn', true);
});

socket.on('client:restart', () => {
  drawBtn.style.display = 'none';
  playerHand.style.display = 'none';
  seats.style.display = 'block';
  startBtn.style.display = 'inline-block';
  usernameForm.style.display = 'block';

  document.querySelector('.turn-txt').textContent = 'Waiting for game to begin';

  restartBtn.disabled = true;
  startBtn.disabled = false;

  for (let seat of seats.children) {
    if (seat.textContent === 'Sit Down') {
      startBtn.disabled = true;
    }
  }

  const lastPlayed = document.querySelector('.last-played');
  if (lastPlayed) {
    lastPlayed.classList.remove('last-played');
  }

  for (let space of gameBoard.children) {
    space.classList.remove('orange');
    space.classList.remove('teal');
  }
});

socket.on('client:sit', (room, username, playerNum, socketID) => {
  document.querySelector(`.player-${playerNum}`).textContent = username;
  document.querySelector(`.player-${playerNum}`).disabled = true;
  document.querySelector(`.player-${playerNum}`).setAttribute('id', socketID);

  chat.innerHTML += `<p class="chat-action">${username} sat down as Player ${playerNum}</p>`;
  chat.scrollIntoView(false);
  log.innerHTML = `<p class="chat-action">${username} sat down as Player ${playerNum}</p>`;

  if (room.players.length >= 4) {
    startBtn.disabled = false;
  }
});

socket.on('client:sit disable', () => {
  for (let btn of document.querySelectorAll('.sit-btn')) {
    if (btn.textContent === 'Sit Down') {
      btn.disabled = true;
    }
  }
});

socket.on('client:stand', async data => {
  if (!data.error) {
    chat.innerHTML += `<p class="chat-action">${data.username} has left the game</p>`;
    chat.scrollIntoView(false);
    log.innerHTML = `<p class="chat-action">${data.username} has left the game</p>`;

    document.querySelector(`#${data.socketID}`).textContent = 'Sit Down';
    document.querySelector(`#${data.socketID}`).disabled = false;
    document.querySelector(`#${data.socketID}`).removeAttribute('id');
  }
});

socket.on('client:start', () => {
  gameBoard.style.pointerEvents = 'all';
  drawBtn.style.display = 'inline-block';
  playerHand.style.display = 'grid';
  seats.style.display = 'none';
  startBtn.style.display = 'none';
  usernameForm.style.display = 'none';
  localStorage.setItem('turn', false);
  document.querySelector('.chat').innerHTML += `<p class="chat-action">Game started</p>`;
});

socket.on('client:turn', room => {
  console.log(room.turn);
  updateTurnText(room);
});

socket.on('client:winner', team => {
  gameBoard.style.pointerEvents = 'none';
  restartBtn.disabled = false;
  chat.innerHTML += `<p class="chat-action">${team.toUpperCase()} team wins!</p>`;
  chat.scrollIntoView(false);
  log.innerHTML = `<p class="chat-action">${team.toUpperCase()} team wins!</p>`;
});
