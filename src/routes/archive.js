const { Archive } = require('../models/room');
const express = require('express');
const router = express.Router();

// Read all games
router.get('/', async (req, res) => {
  try {
    const rooms = await Archive.find({});
    res.status(200).send(rooms);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Read specifc game
router.get('/:id', async (req, res) => {
  try {
    const room = await Archive.findById(req.params.id);
    res.status(200).send(room);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add to archive
router.post('/', async (req, res) => {
  let room = new Archive(req.body);

  try {
    await room.save();
    room = await Archive.findById(room._id);
    res.status(201).send(room);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
