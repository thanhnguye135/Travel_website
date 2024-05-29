const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Hóa đơn phải có chuyến đi kèm theo!'],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Hóa đơn phải có người dùng đăng kí!'],
  },

  price: {
    type: Number,
    required: [true, 'Hóa đơn phải có giá trị của chuyến đi!'],
  },

  createAt: {
    type: Date,
    default: Date.now(),
  },

  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

const BookingTour = mongoose.model('BookingTour', bookingSchema);

module.exports = BookingTour;
