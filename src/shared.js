const readRoom = async id => {
  const res = await fetch(`http://localhost:3000/rooms/${id}`);
  const data = await res.json();

  return data;
};

const updateRoom = async (id, data) => {
  await fetch(`http://localhost:3000/rooms/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};

export { readRoom, updateRoom };
