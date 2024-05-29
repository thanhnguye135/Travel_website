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

exports.getReview = catchingErrorAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  // console.log(review);

  if (!review) {
    return next(
      new AppError('Không có bài đánh giá nào được tìm thấy với id này', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
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

exports.updateReview = catchingErrorAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!review) {
    return next(
      new AppError('Không có đánh giá nào được tìm thấy với id này', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.deleteReviewTour = catchingErrorAsync(async (req, res, next) => {
  const id = req.params.id;
  const doc = await Review.deleteMany({ tour: id });
  // console.log(doc.deletedCount);
  if (!doc) {
    return next(
      new AppError('Không đánh giá nào được tìm thấy với id này', 404)
    );
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteReviewUser = catchingErrorAsync(async (req, res, next) => {
  const id = req.params.id;
  const doc = await Review.deleteMany({ user: id });
  // console.log(doc.deletedCount);
  if (!doc) {
    return next(
      new AppError('Không đánh giá nào được tìm thấy với id này', 404)
    );
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteReview = catchingErrorAsync(async (req, res, next) => {
  const id = req.params.id;
  const doc = await Review.findByIdAndDelete(id);
  // console.log(doc.deletedCount);
  if (!doc) {
    return next(
      new AppError('Không đánh giá nào được tìm thấy với id này', 404)
    );
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
