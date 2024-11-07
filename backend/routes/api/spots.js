
const express = require('express');
const { Spot, User } = require('../../db/models'); 
const router = express.Router();

// Get all spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll();
  res.status(200).json({ Spots: spots });
});

// Get spot by ID
router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  res.status(200).json(spot);
});

module.exports = router;
