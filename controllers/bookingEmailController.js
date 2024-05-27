const BookingEmail = require('../models/bookingEmailModel');

exports.createBookingEmail = async (req, res) => {
  const newBookingEmail = await BookingEmail.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newBookingEmail,
    },
  });
};
