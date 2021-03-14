const findMax = (value, hand) => {
  let max = -1;
  for (let card of hand) {
    if (card.value > max && card.value <= value) {
      max = card.value;
    }
  }

  return max;
};

const countConsecutive = (board, index, direction, count = 1) => {
  const next = index + direction;

  if (board[next]) {
    if (board[next].team !== board[index].team) {
      return count;
    } else if (direction === 1 && next % 10 === 0) {
      // If checking to the right and next value is in the first column
      return count;
    } else if (direction === -1 && next % 10 === 9) {
      // If checking to the left and next value is in the last column
      return count;
    } else if (board[next].hasPeg) {
      count++;
      count = countConsecutive(board, next, direction, count);
    }
  }

  return count;
};

const isWinner = (board, value) => {
  const index = board.findIndex(space => space.value === value);
  const directions = [1, 9, 10, 11];

  for (let direction of directions) {
    const one = countConsecutive(board, index, direction);
    const two = countConsecutive(board, index, direction * -1);
    if (one + two > 5) {
      return true;
    }
  }
};

module.exports = { findMax, isWinner };
