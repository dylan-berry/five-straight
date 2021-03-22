const Room = require('../models/room');
const express = require('express');
const router = express.Router();

const board = require('../assets/board.json');
const deck = require('../assets/deck.json');

// Read all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.status(200).send(rooms);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Read specifc room
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
  let room = new Room(req.body);

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

    if (updates.length === 0) {
      room.board = board;
      room.deck = deck;
      room.turn = 1;
      room.turnOwner = null;
      for (let player of room.players) {
        player.hand = [];
      }
    } else {
      for (let update of updates) {
        console.log(update);
        room[update] = req.body[update];
      }
    }

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

module.exports = router;
