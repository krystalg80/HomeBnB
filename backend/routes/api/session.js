const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage } = require('../../db/models');
const router = express.Router();


const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];


// Log In a User
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    // Check if the login is for the demo user (for testing purposes)
    const demoUser = {
      username: 'Demo-lition',
      password: 'password', 
    };

    if (credential === demoUser.username && password === demoUser.password) {
      // Create a fake user object for the demo user
      const safeUser = {
        id: 1, // You can use a static ID for the demo user
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        username: 'Demo-lition',
      };

      // Set token for demo user
      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }

    //regular login process below

    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);

// Log out
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

// Get the Current User
router.get(
  '/:id',
  restoreUser,  // Optional: Only use if you want to validate session for the user making the request
  async (req, res) => {
    const { id } = req.params;  // Get the user ID from the route parameter

    // Look up the user by the provided ID
    const user = await User.findByPk(id);  // Using Sequelize's findByPk method
    if (user) {
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
      return res.json({
        user: safeUser
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }
);

// Get all Spots owned by the Current User
router.get('/spots', requireAuth, async (req, res) => {
  const user = req.user;
  const spots = await Spot.findAll({ where: { ownerId: user.id } });
  res.status(200).json({ Spots: spots });
});

// Get all Reviews of the Current User
router.get('/reviews', requireAuth, async (req, res) => {
  const user = req.user;

  try {
    const reviews = await Review.findAll({
      where: { userId: user.id },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          attributes: [
            'id', 'ownerId', 'address', 'city',
            'state', 'country', 'lat', 'lng',
            'name', 'price', 'previewImage'
          ]
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    res.status(200).json({ Reviews: reviews });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed getting reviews.'
    });
  }
});



module.exports = router;