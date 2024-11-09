const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Review, ReviewImage, Spot } = require('../../db/models');
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();

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


module.exports = router;