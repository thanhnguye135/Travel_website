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

module.exports = reviewRouter;
