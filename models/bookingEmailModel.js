const mongoose = require('mongoose');

const bookingEmailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập họ tên và không để trống thông tin!'],
  },

  email: {
    type: String,
    required: [true, 'Vui lòng nhập họ tên và không để trống thông tin!'],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const BookingEmail = mongoose.model('BookingEmail', bookingEmailSchema);

module.exports = BookingEmail;
