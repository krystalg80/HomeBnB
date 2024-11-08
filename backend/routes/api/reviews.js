const express = require('express');
const { requireAuth } = require('../utils/auth');
const { User, Review, Spot } = require('../db/models'); //are we going to add a review image? not sure
const router = express.Router();

// 1. Get all Reviews of the Current User
router.get('/users/:userId/reviews', requireAuth, async (req, res, next) => {
})

// 2. Get all Reviews by a Spot's id
router.get('/spots/:spotId/reviews', async (req, res, next) => {
})

// 3. Create a Review for a Spot
router.post('/spots/:spotId/reviews', requireAuth, async (req, res, next) => {
})

// 4. Add an Image to a Review
router.post('/reviews/:reviewId/reviewImages', requireAuth, async (req, res, next) => {
})

// 5. Edit a Review
router.patch('/reviews/:reviewId', requireAuth, async (req, res, next) => {
})

// 6. Delete a Review
router.delete('/reviews/:reviewId', requireAuth, async (req, res, next) => {
})

module.exports = router;
