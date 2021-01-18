const Room = require('../models/room');
const express = require('express');
const router = express.Router();

const board = require('../assets/board.json');
const deck = require('../assets/deck.json');
const players = [];

// Read rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.status(200).send(rooms);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Read room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).send(room);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create room
router.post('/', async (req, res) => {
  let room = new Room({ board, deck, players, name: null });

  try {
    await room.save();
    room = await Room.findById(room._id);
    res.status(201).send(room);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Update room
router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);

  try {
    const room = await Room.findById(req.params.id);

    for (let update of updates) {
      if (update === 'restart') {
        room.turn = 1;
        room.board = board;
        room.deck = deck;
        room.turnOwner = null;
        for (let player of room.players) {
          player.hand = [];
        }
      } else {
        room[update] = req.body[update];
      }
    }

    await room.save();
    res.status(200).send(room);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add player
router.patch('/player/:id', async (req, res) => {
  const { players } = req.body;

  try {
    const room = await Room.findById(req.params.id);
    room.players = room.players.concat(players);

    await room.save();
    res.status(200).send(room);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    res.status(200).send(room);
  } catch (error) {
    res.status(400).send({ error });
  }
});

// Remove player
router.delete('/player/:id', async (req, res) => {
  const { socketID } = req.body;
  console.log(`User ${socketID} is being removed`);
  const room = await Room.findById(req.params.id);
  const player = room.players.filter(player => player.socketID === socketID);

  if (player.length > 0) {
    try {
      room.players = room.players.filter(player => player.socketID !== socketID);

      await room.save();
      res.status(200).send(player[0]);
    } catch (error) {
      res.status(400).send({ error });
    }
  } else {
    res.status(400).send({ error: 'Player does not exist.' });
  }
});

module.exports = router;
