const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.review = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    console.log(review.rating)
    await camp.save();
    req.flash('success', "Cool! You've succesfully created a new review.");
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.destroy = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "You've succesfully deleted a review.");
    res.redirect(`/campgrounds/${id}`);
};