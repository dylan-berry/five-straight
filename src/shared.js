const fetch = require('node-fetch');

// Room
const readRoom = async id => {
  try {
    const res = await fetch(`http://localhost:3000/rooms/${id}`);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(['[ERROR]', error.message]);
  }
};

const updateRoom = async (id, data) => {
  try {
    await fetch(`http://localhost:3000/rooms/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.log(['[ERROR]', error.message]);
  }
};

// Player
const readPlayer = async (roomID, socketID) => {
  try {
    const res = await fetch(`http://localhost:3000/rooms/${roomID}`);
    const data = await res.json();

    const player = data.players.find(player => player.socketID === socketID);

    return player;
  } catch (error) {
    console.log(['[ERROR]', error.message]);
  }
};

module.exports = { readRoom, updateRoom, readPlayer };
