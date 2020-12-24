const readRoom = async id => {
  const res = await fetch(`/rooms/${id}`);
  const data = await res.json();
  return data;
};

const updateRoom = async (id, object) => {
  const json = JSON.stringify(object);
  const res = await fetch(`/rooms/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: json
  });

  const data = await res.json();
  return data;
};

const addPlayer = async (id, username, playerNum, team, socketID) => {
  const json = JSON.stringify({ players: [{ username, playerNum, team, socketID }] });

  const res = await fetch(`/rooms/player/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: json
  });

  const data = await res.json();
  return data;
};

const removePlayer = async (id, socketID) => {
  const json = JSON.stringify({ socketID });

  const res = await fetch(`/rooms/player/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: json
  });

  const data = await res.json();
  return data;
};

export { readRoom, updateRoom, addPlayer, removePlayer };
