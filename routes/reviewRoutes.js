const express = require('express');
const reviewController = require('../controllers/reviewController');
const authenController = require('../controllers/authenController');
const reviewRouter = express.Router();

reviewRouter
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authenController.protect,
    authenController.restrictTo('user'),
    reviewController.createReview
  );

reviewRouter.route('/users/:id').delete(reviewController.deleteReviewUser);
reviewRouter.route('/tours/:id').delete(reviewController.deleteReviewTour);
reviewRouter
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview);

module.exports = reviewRouter;
