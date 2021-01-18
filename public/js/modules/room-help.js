import { readRoom } from './api-calls.js';

const id = window.location.search.slice(6);

const drawBtn = document.querySelector('.draw-btn');
const playerHand = document.querySelector('.cards-grid');
const seats = document.querySelector('.seats');
const startBtn = document.querySelector('.start-btn');
const usernameForm = document.querySelector('.username-form');

// Load board and players
const populateData = async () => {
  const room = await readRoom(id);

  updateUser();

  for (let space of room.board) {
    if (space.hasPeg) {
      document.querySelector('.game-board').innerHTML += `<div class="cell ${space.team}">${space.value}</div>`;
    } else {
      document.querySelector('.game-board').innerHTML += `<div class="cell">${space.value}</div>`;
    }
  }

  if (room.turn === 1) {
    // Nobody has played yet
    if (room.players.length > 0) {
      for (let player of room.players) {
        document.querySelector(`.player-${player.playerNum}`).textContent = player.username;
        document.querySelector(`.player-${player.playerNum}`).disabled = true;
        document.querySelector(`.player-${player.playerNum}`).setAttribute('id', `${player.socketID}`);
      }
    }
  } else {
    // Game has started
    updateTurnText(room);
    drawBtn.style.display = 'inline-block';
    playerHand.style.display = 'grid';
    seats.style.display = 'none';
    startBtn.style.display = 'none';
    usernameForm.style.display = 'none';

    // This won't work because when a player disconnects, it removes all their info from the room in the database, meaning there is no matching player
    // const hand = room.players.find(player => player.username === localStorage.getItem('username')).hand;
    // for (let card of hand) {
    //   playerHand.innerHTML += `<div class="card-cell">${card.value}</div>`;
    // }
  }
};

const updateTurnText = room => {
  if (localStorage.getItem('username') === room.turnOwner) {
    document.querySelector('.turn-txt').textContent = 'Your turn';
    localStorage.setItem('turn', true);
  } else {
    document.querySelector('.turn-txt').textContent = `${room.turnOwner}'s turn`;
  }
};

const updateUser = () => {
  const usernameForm = document.querySelector('.username-form');

  if (localStorage.getItem('username')) {
    usernameForm.innerHTML = `<h2 class="m-0">Hi, ${localStorage.getItem('username')}</h2>`;
  } else {
    usernameForm.innerHTML = `
      <label for="username">Name:</label>
      <input class="username-input" type="text" name="username" placeholder="Enter your name" />
      <button class="ok-btn btn blue">OK</button>
    `;

    for (let btn of document.querySelectorAll('.sit-btn')) {
      btn.disabled = true;
    }
  }
};

export { populateData, updateTurnText };
