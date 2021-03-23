const axios = require('axios');
const host = process.env.HOST;

// Room
const readRoom = async id => {
  try {
    const res = await axios.get(`${host}/rooms/${id}`);
    return res.data;
  } catch (error) {
    console.log(['[ERROR]', error.message]);
  }
};

const updateRoom = async (id, data) => {
  try {
    await axios.patch(`${host}/rooms/${id}`, data);
  } catch (error) {
    console.log(['[ERROR]', error.message]);
  }
};

// Player
const readPlayer = async (roomID, socketID) => {
  try {
    const res = await axios.get(`${host}/rooms/${roomID}`);
    const player = res.data.players.find(player => player.socketID === socketID);

    return player;
  } catch (error) {
    console.log(['[ERROR]', error.message]);
  }
};

module.exports = { readRoom, updateRoom, readPlayer };
