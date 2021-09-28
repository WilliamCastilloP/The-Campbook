const Campground = require('./models/campground');
const Review = require('./models/review');
const { campSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./helpers/ExpressError.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.backTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const {id} = req.params;
    const camp = await Campground.findById(id)
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', "Sorry, you do not own this camp!");
        res.redirect(`/campground/${id}`)
    }
    next();
}

module.exports.isReviewOwner = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "Sorry, you do not own this review!");
        res.redirect(`/campground/${id}`)
    }
    next();
}


module.exports.validateCamp = (req, res, next) => {
    const { error } = campSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

