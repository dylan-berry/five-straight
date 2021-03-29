const mongoose = require('mongoose');

const board = require('../assets/board.json');
const deck = require('../assets/deck.json');

const roomSchema = new mongoose.Schema({
  board: [
    {
      value: {
        type: Number
      },
      hasPeg: {
        type: Boolean
      },
      team: {
        type: String
      },
      turn: {
        type: Number
      },
      cardPlayed: {
        type: Number
      },
      playedBy: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date()
  },
  deck: [
    {
      value: {
        type: Number
      }
    }
  ],
  gameState: {
    type: Number,
    default: 0
  },
  logs: [
    {
      type: String
    }
  ],
  maxPlayers: {
    type: Number
  },
  maxTeams: {
    type: Number
  },
  name: {
    type: Number
  },
  players: [
    {
      username: {
        type: String
      },
      playerNum: {
        type: Number
      },
      team: {
        type: String
      },
      hand: {
        type: [
          {
            value: {
              type: Number
            }
          }
        ]
      },
      socketID: {
        type: String
      }
    }
  ],
  seats: [
    {
      text: {
        type: String
      },
      team: {
        type: String
      }
    }
  ],
  teams: [
    {
      type: String
    }
  ],
  turn: {
    type: Number,
    default: 1
  },
  turnOwner: {
    type: String,
    default: null
  },
  winner: {
    type: String,
    default: null
  }
});

// Generate random name for room
roomSchema.pre('save', async function(next) {
  const room = this;

  if (room.isModified('name')) {
    room.name = Math.floor(Math.random() * 999);
    room.board = board;
    room.deck = deck;
  }

  next();
});

const Room = mongoose.model('Room', roomSchema);
const Archive = mongoose.model('Archive', roomSchema);

module.exports = { Room, Archive };
