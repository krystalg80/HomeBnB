const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Review, ReviewImage, Spot } = require('../../db/models');
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();

const validateReview = [
  check('review')
    .optional()
    .notEmpty()
    .withMessage('Review is required.')
    .bail()
    .isString()
    .withMessage('Review must be a string.')
    .bail()
    .isLength({ max: 250 })
    .withMessage('Review must be a maximum of 250 characters.'),
  check('stars')
    .optional()
    .notEmpty()
    .withMessage('Star rating is required.')
    .bail()
    .custom(value => {
      if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 5) {
        throw new Error('Stars must be a number between 1 and 5.');
      }
      return true;
    }),
  handleValidationErrors  
];

// Delete an existing review
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const user = req.user;
  const { reviewId } = req.params;

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review does not exist.' });
    }

    if (review.userId !== user.id) {
      return res.status(403).json({
        message: 'Not authorized.'
      });
    }

    await review.destroy();

    return res.status(200).json({
      message: 'Review successfully deleted'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete review.'
    });
  }
});

// Edit a Review
router.patch('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const user = req.user;

  try {
    const currentReview = await Review.findByPk(reviewId);

    if (!currentReview) {
      return res.status(404).json({
        message: 'Review could not be found.'
      });
    }

    if (currentReview.userId !== user.id) {
      return res.status(403).json({
        message: 'Not authorized.'
      });
    }

    if (review) currentReview.review = review;
    if (stars) currentReview.stars = stars;

    await currentReview.save();

    return res.json({
      id: currentReview.id,
      userId: currentReview.userId,
      spotId: currentReview.spotId,
      review: currentReview.review,
      stars: currentReview.stars,
      createdAt: currentReview.createdAt,
      updatedAt: currentReview.updatedAt
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to update review.'
    });
  }
});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const user = req.user;

  try {
    const review = await Review.findByPk(reviewId);
    
    if (!review) {
      return res.status(404).json({
        message: 'Review could not be found.'
      });
    }

    if (review.userId !== user.id) {
      return res.status(403).json({
        message: 'Not authorized.'
      });
    }

    const images = await ReviewImage.count({ where: { reviewId } });

    if (images >= 10) {
      return res.status(403).json({
        message: 'Maximum number of images has been reached.'
      });
    }

    const newImage = await ReviewImage.create({
      reviewId,
      url
    });

    return res.status(201).json({
      id: newImage.id,
      url: newImage.url
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to add image to review.'
    });
  }
});

// Delete an Image for a Review
router.delete('/:reviewId/images/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const user = req.user;

  try {
    const reviewImage = await ReviewImage.findByPk(imageId);

    if (!reviewImage) {
      return res.status(404).json({
        message: 'Review image could not be found.'
      });
    }

    const review = await Review.findByPk(reviewImage.reviewId);

    if (!review) {
      return res.status(404).json({
        message: 'Review could not be found.'
      });
    }

    if (review.userId !== user.id) {
      return res.status(403).json({
        message: 'Not authorized.'
      });
    }

    await reviewImage.destroy();

    return res.json({
      message: 'Image successfully deleted.'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete image.'
    });
  }
});


module.exports = router;