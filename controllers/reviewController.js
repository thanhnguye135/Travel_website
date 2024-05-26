const Review = require('../models/reviewModel');
const catchingErrorAsync = require('../utils/catchingErrorAsync');
const AppError = require('../utils/appError');

exports.getAllReviews = catchingErrorAsync(async (req, res, next) => {
  let obj = {};
  if (req.params.tourId) obj = { tour: req.params.tourId };

  const reviews = await Review.find(obj);

  if (!reviews) {
    return next(new AppError('Chuyến đi chưa có bài đánh giá nào', 404));
  }

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchingErrorAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  // console.log(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
