const listRooms = async () => {
  const res = await fetch('/rooms');

  const data = await res.json();

  document.querySelector('.rooms-grid').innerHTML = '';
  for (let room of data) {
    document.querySelector('.rooms-grid').innerHTML += `
      <div class="text-center rounded p-5 m-4">
        <h3>Room ${room.name}</h3>
        <p>Players ${room.players.length}/4</p>
        <a href="/room.html?room=${room._id}" class="btn btn-primary">Join Game</a>
      </div>
    `;
  }
};

const handleCreateRoom = async () => {
  const res = await fetch('/rooms', {
    method: 'POST',
    body: {
      msg: 'Create room'
    }
  });

  const data = await res.json();
  console.log(`Room ${data.name} created: \n`, data);
};

export { listRooms, handleCreateRoom };
