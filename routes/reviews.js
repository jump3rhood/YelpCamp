const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Campground = require('../models/campground');
const Review = require('../models/review');

const { reviewSchema} = require('../schemas');

const validateReview = (req, res, next)=> {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req,res)=> {
    const campground= await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created a new review');
    res.redirect(`/campgrounds/${campground._id}`);
}));
// Delete a review and its corresponding reviewId from campground
router.delete('/:reviewId', catchAsync(async (req, res)=> {
    const {id, reviewId } = req.params;
    // Update reviews array i.e. remove deleted review using $pull
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    //Delete Review from DB
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully deleted review');
    res.redirect('/campgrounds');
}));

module.exports = router;