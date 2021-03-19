const updateTurnText = room => {
  if (localStorage.getItem('username') === room.turnOwner) {
    document.querySelector('.turn-txt').textContent = 'Your turn';
    localStorage.setItem('turn', true);
  } else {
    document.querySelector('.turn-txt').textContent = `${room.turnOwner}'s turn`;
  }
};

export { updateTurnText };
