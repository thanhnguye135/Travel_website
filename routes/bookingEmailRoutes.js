const express = require('express');
const bookingEmailController = require('../controllers/bookingEmailController');

const bookingEmailRouter = express.Router();

bookingEmailRouter
  .route('/booking-email')
  .post(bookingEmailController.createBookingEmail);

module.exports = bookingEmailRouter;
