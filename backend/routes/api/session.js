const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
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

// Log in
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

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

// Restore session user
router.get(
  '/',
  (req, res) => {
    const { user } = req;
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
    } else return res.json({ user: null });
  }
);

// Get spots owned by the current user
router.get('/spots', async (req, res) => {
  const user = req.user;
  const spots = await Spot.findAll({ where: { ownerId: user.id } });
  res.status(200).json({ Spots: spots });
});

// Get all Reviews of the Current User
router.get('/reviews', async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

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
            'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng',
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
    next(error);
  }
});



module.exports = router;