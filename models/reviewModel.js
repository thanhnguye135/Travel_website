const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Đánh giá của bạn không được để trống'],
    },

    rating: {
      type: Number,
      default: 0,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },

    creatAt: {
      type: Date,
      default: Date.now(),
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' });
  //   this.populate({ path: 'tour', select: 'name' });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
