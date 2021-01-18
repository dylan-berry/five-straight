const mongoose = require('mongoose');

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
    default: Date.now
  },
  deck: [
    {
      value: {
        type: Number
      }
    }
  ],
  name: {
    type: Number
  },
  open: {
    type: Boolean,
    default: true
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
  turn: {
    type: Number,
    default: 1
  },
  turnOwner: {
    type: String,
    default: null
  }
});

// Generate random name for room
roomSchema.pre('save', async function (next) {
  const room = this;

  if (room.isModified('name')) {
    room.name = Math.floor(Math.random() * 999);
  }

  next();
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
