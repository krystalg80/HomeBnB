const express = require('express');
const { Spot } = require('../../db/models'); 
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSpot = [
  check('address')
    .notEmpty()
    .withMessage('Address is required.'),
  check('city')
    .notEmpty()
    .withMessage('City is required.'),
  check('state')
    .notEmpty()
    .withMessage('State is required.'),
  check('country')
    .notEmpty()
    .withMessage('Country is required.'),
  check('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90.'),
  check('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a number between -180 and 180.'),
  check('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters.'),
  check('description')
    .notEmpty()
    .withMessage('Description is required.'),
  check('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number.'),
  handleValidationErrors
]; 


// Create a new spot
router.post(
  '/',
  requireAuth,
  validateSpot,
  async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { user } = req;
    try {
      const newSpot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      });

      res.status(201).json(newSpot);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create spot' });
    }
  }
);


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