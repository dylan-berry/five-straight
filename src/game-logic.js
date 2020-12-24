const findMax = (value, hand) => {
  let max = -1;
  for (let card of hand) {
    if (card.value > max && card.value <= value) {
      max = card.value;
    }
  }

  return max;
};

const countConsecutive = (board, space, direction, count = 1) => {
  const next = space + direction;

  if (next.team !== space.team) {
    return count;
  } else if (direction === 1 && next % 10 === 0) {
    return count;
  } else if (direction === -1 && next % 10 === 9) {
    return count;
  } else if (board[next]) {
    if (board[next].hasPeg === true) {
      count++;
      count = countConsecutive(board, next, direction, count);
    }
  }
  return count;
};

const isWinner = (board, value) => {
  const directions = [1, 9, 10, 11];

  for (let direction of directions) {
    const one = countConsecutive(board, board.indexOf(value), direction);
    const two = countConsecutive(board, board.indexOf(value), direction * -1);
    if (one + two > 5) {
      return true;
    }
  }
};

module.exports = { findMax };
