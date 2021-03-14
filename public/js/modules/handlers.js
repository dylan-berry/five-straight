import { readRoom, addPlayer, removePlayer, updateRoom } from './api-calls.js';
import { dealCards, drawCard } from './game-help.js';

const id = window.location.search.slice(6);

// Click game board
const handleBoardClick = async e => {
  // if (eval(localStorage.getItem('turn')) === true) {
  // localStorage.setItem('turn', false);

  const room = await readRoom(id);
  const spaceValue = Number(e.target.textContent);
  const player = room.players.find(player => player.username === localStorage.getItem('username'));
  const space = room.board.find(space => space.value === spaceValue);

  socket.emit('server:play', space, player, room);
  // } else {
  //   document.querySelector('.chat').innerHTML += `<p class="chat-action text-danger">It's not your turn</p>`;
  // }
};

// Click 'Draw Card' button
const handleDraw = async () => {
  if (eval(localStorage.getItem('turn')) === true) {
    localStorage.setItem('turn', false);
    const room = await readRoom(id);
    const player = room.players.find(player => player.username === localStorage.getItem('username'));

    if (player.hand.length < 3) {
      drawCard(room, player);
      socket.emit('server:draw', player, room);
    } else {
      localStorage.setItem('turn', true);
      document.querySelector('.chat').innerHTML += `<p class="chat-action text-danger">You already have 3 cards.</p>`;
    }
  } else {
    document.querySelector('.chat').innerHTML += `<p class="chat-action text-danger">It's not your turn</p>`;
  }
};

// Submit username
const handleForm = () => {
  const usernameForm = document.querySelector('.username-form');
  localStorage.setItem('username', document.querySelector('.username-input').value);
  localStorage.setItem('turn', false);
  usernameForm.innerHTML = `<h2 class="m-0">Hi, ${localStorage.getItem('username')}</h2>`;

  for (let btn of document.querySelectorAll('.sit-btn')) {
    if (btn.textContent === 'Sit Down') {
      btn.disabled = false;
    }
  }
};

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
  const data = await updateRoom(id, { restart: [] });
  socket.emit('server:restart');
};

// Click gear icon
const handleSettings = () => {
  const style1 = `
  'board chat'
  'buttons buttons'
  'cards cards'`;

  const style2 = `
  'board cards'
  'board chat'
  'buttons buttons'`;

  const gameGrid = document.querySelector('.game-grid');
  const chat = document.querySelector('.chat');
  if (gameGrid.getAttribute('style') !== `grid-template-areas: "board cards" "board chat" "buttons buttons";`) {
    gameGrid.style.gridTemplateAreas = style2;
    chat.style.maxHeight = '368px';
  } else {
    gameGrid.style.gridTemplateAreas = style1;
    chat.style.maxHeight = '550px';
  }
};

// Click 'Sit Down' button
const handleSitDown = async e => {
  const username = localStorage.getItem('username');
  const playerNum = e.target.classList[0].slice(7);
  const team = e.target.classList[1];
  const socketID = socket.id;

  localStorage.setItem('playerNum', playerNum);
  localStorage.setItem('team', team);

  const room = await addPlayer(id, username, playerNum, team, socketID);

  socket.emit('server:sit', room, username, playerNum, socketID);
};

// Click 'Start Game' button
const handleStart = async () => {
  let room = await readRoom(id);
  const player1 = room.players.find(player => player.playerNum === 1);
  room.turnOwner = player1.username;

  dealCards(room);

  socket.emit('server:start', room);
};

export { handleBoardClick, handleDraw, handleForm, handleReset, handleRestart, handleSettings, handleSitDown, handleStart };
