const express = require('express');
const tourController = require('../controllers/tourController');
const authenController = require('../controllers/authenController');
const reviewController = require('../controllers/reviewController');
const tourRouter = express.Router();

// tourRouter.param('id', tourController.checkID);

tourRouter
  .route('/top-5-tours')
  .get(tourController.aliasGetTour, tourController.getAllTours);

tourRouter.route('/tour-stats').get(tourController.getTourStats);

tourRouter
  .route('/monthly-plan/:year')
  .get(
    authenController.protect,
    authenController.restrictTo('admin'),
    tourController.getMonthlyPlan
  );

tourRouter
  .get(tourController.getAllTours)
  .post(
    authenController.protect,
    authenController.restrictTo('admin'),
    tourController.uploadTourImages,
    tourController.createTour
  );

tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authenController.protect,
    authenController.restrictTo('admin'),
    tourController.uploadTourImages,
    tourController.updateTour
  )
  .delete(
    authenController.protect,
    authenController.restrictTo('admin'),
    tourController.deleteTour
  );

tourRouter
  .route('/:tourId/reviews')
  .get(reviewController.getAllReviews)
  .post(
    authenController.protect,
    authenController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = tourRouter;
