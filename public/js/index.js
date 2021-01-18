import { listRooms, handleCreateRoom } from './modules/index-help.js';

const createRoomBtn = document.querySelector('.create-room-btn');

listRooms();

createRoomBtn.addEventListener('click', () => {
  handleCreateRoom();
});
