const cron = require('node-cron');
const axios = require('axios');

const api = require('./api-calls');
const host = process.env.HOST;

const removeInactiveGames = async () => {
  const res = await axios.get(`${host}/rooms`);
  const rooms = res.data;
  const inactiveRooms = rooms.filter(room => room.gameState === 0 || room.gameState === 1);

  for (let room of inactiveRooms) {
    await api.deleteRoom(room._id);
  }
};

const schedule = cron.schedule('0 0 * * *', removeInactiveGames, {
  scheduled: true,
  timezone: 'America/Denver'
});

module.exports = { schedule };
