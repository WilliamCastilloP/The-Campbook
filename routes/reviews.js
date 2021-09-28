const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const wrapper = require('../helpers/wrapper.js');
const { validateReview, isLoggedIn, isReviewOwner} = require('../middleware');
const { review , destroy } = require('../controllers/reviews');

// REVIEWS ROUTE
router.post('/', isLoggedIn, validateReview,  wrapper(review));

// DESTROY ROUTE
router.delete('/:reviewId', isLoggedIn, isReviewOwner, wrapper(destroy))

module.exports = router;
