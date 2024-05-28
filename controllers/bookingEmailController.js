const BookingEmail = require('../models/bookingEmailModel');
const AppError = require('../utils/appError');
const catchingErrorAsync = require('../utils/catchingErrorAsync');

exports.createBookingEmail = async (req, res) => {
  const newBookingEmail = await BookingEmail.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newBookingEmail,
    },
  });
};

exports.deleteBookingEmail = catchingErrorAsync(async (req, res, next) => {
  const doc = await BookingEmail.findByIdAndDelete(req.params.id);
  // console.log(doc);
  if (!doc) {
    return next(
      new AppError('Không tài liệu nào được tìm thấy với id này', 404)
    );
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
