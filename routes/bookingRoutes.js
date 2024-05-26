const express = require('express');
const authenController = require('../controllers/authenController');
const bookingController = require('../controllers/bookingController');

const bookingRouter = express.Router();

bookingRouter.use(authenController.protect);
bookingRouter.get(
  '/checkout-session/:tourID',
  authenController.protect,
  bookingController.getCheckoutSession
);

bookingRouter.use(authenController.restrictTo('admin'));
bookingRouter
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

bookingRouter
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = bookingRouter;
