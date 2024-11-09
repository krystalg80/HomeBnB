const express = require('express');
const { Spot, SpotImage } = require('../../db/models'); 
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateCreateSpot = [
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
    .notEmpty()
    .withMessage('Latitude is required.')
    .bail()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90.'),
  check('lng')
    .notEmpty()
    .withMessage('Longitude is required.')
    .bail()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a number between -180 and 180.'),
  check('name')
    .notEmpty()
    .withMessage('Name is required.')
    .bail()
    .isLength({ max: 50 })
    .withMessage('Name cannot be longer than 50 characters.'),
  check('description')
    .notEmpty()
    .withMessage('Description is required.'),
  check('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number.'),
  handleValidationErrors
];

const validateEditSpot = [
  check('address')
    .optional()
    .notEmpty()
    .withMessage('Address is required.'),
  check('city')
    .optional()
    .notEmpty()
    .withMessage('City is required.'),
  check('state')
    .optional()
    .notEmpty()
    .withMessage('State is required.'),
  check('country')
    .optional()
    .notEmpty()
    .withMessage('Country is required.'),
  check('lat')
    .optional()
    .notEmpty()
    .withMessage('Latitude is required.')
    .bail()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90.'),
  check('lng')
    .optional()
    .notEmpty()
    .withMessage('Longitude is required.')
    .bail()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a number between -180 and 180.'),
  check('name')
    .optional()
    .notEmpty()
    .withMessage('Name is required.')
    .bail()
    .isLength({ max: 50 })
    .withMessage('Name cannot be longer than 50 characters.'),
  check('description')
    .optional()
    .notEmpty()
    .withMessage('Description is required.'),
  check('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number.'),
  handleValidationErrors
];


// Create a new spot
router.post('/', requireAuth, validateCreateSpot, async (req, res) => {
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
      res.status(500).json({ message: 'Failed to create spot.' });
    }
  }
);

// Get all Spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll();
  res.status(200).json({ Spots: spots });
});

// Get details of a Spot
router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  
  if (!spot) {
    return res.status(404).json({
      message: "Spot could not be found." 
    });
  }

  res.status(200).json(spot);
});


// Edit a spot
router.patch('/:spotId', requireAuth, validateEditSpot, async (req, res) => {
  const { spotId } = req.params;
  const user = req.user;
  const { address, city, state, country, lat, lng, name, description, price } = req.body

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: 'Spot could not be found.'
      });
    }

    if (spot.ownerId !== user.id) {
      return res.status(403).json({
        message: 'Not authorized.'
      });
    }

    const updatedSpot = await spot.update({
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

    return res.status(200).json(updatedSpot);
  } catch (error) {
    return res.status(500).json({
      message: 'Editing failed.'
    });
  }
});

// Delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
  const user = req.user;
  const { spotId } = req.params;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: 'Spot could not be found.'
      });
    }

    if (spot.ownerId !== user.id) {
      return res.status(403).json({
        message: 'Not authorized.'
      });
    }

    await spot.destroy();

    return res.status(200).json({
      message: 'Spot successfully deleted.'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Deleting failed.'
    });
  }
});

// Delete an Image for a Spot
router.delete('/:spotId/images/:imageId', requireAuth, async (req, res) => {
  const { spotId, imageId } = req.params;
  const user = req.user;

  try {
    const spot = await Spot.findByPk(spotId);
    
    if (!spot) {
      return res.status(404).json({
        message: 'Spot could not be found.'
      });
    }

    if (spot.ownerId !== user.id) {
      return res.status(403).json({
        message: 'Not authorized.'
      });
    }

    const spotImage = await SpotImage.findByPk(imageId);
    
    if (!spotImage) {
      return res.status(404).json({
        message: 'Spot image could not be found.'
      });
    }

    if (spotImage.spotId !== spot.id) {
      return res.status(403).json({
        message: 'You can only delete images from your own spot.'
      });
    }

    await spotImage.destroy();

    return res.status(200).json({
      message: 'Image successfully deleted.'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete image.'
    });
  }
});

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const user = req.user;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: 'Spot could not be found.'
      });
    }

    if (spot.ownerId !== user.id) {
      return res.status(403).json({
        message: 'Not authorized.'
      });
    }

    const spotImage = await SpotImage.create({
      spotId: spot.id,
      url,
      preview
    });

    return res.status(201).json({
      id: spotImage.id,
      url: spotImage.url,
      preview: spotImage.preview,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to add image.'
    });
  }
})

module.exports = router;