socket.on('client:winner', team => {
  gameBoard.style.pointerEvents = 'none';
  restartBtn.disabled = false;
  chat.innerHTML += `<p class="chat-action">${team.toUpperCase()} team wins!</p>`;
  chat.scrollIntoView(false);
  log.innerHTML = `<p class="chat-action">${team.toUpperCase()} team wins!</p>`;
});
