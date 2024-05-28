const express = require('express');
const bookingEmailController = require('../controllers/bookingEmailController');

const bookingEmailRouter = express.Router();

bookingEmailRouter
  .route('/booking-email')
  .post(bookingEmailController.createBookingEmail);

bookingEmailRouter
  .route('/:id')
  .delete(bookingEmailController.deleteBookingEmail);

module.exports = bookingEmailRouter;
