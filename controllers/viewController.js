const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const BookingTour = require('../models/bookingModel');
const BookingEmail = require('../models/bookingEmailModel');
const AppError = require('../utils/appError');
const catchingErrorAsync = require('../utils/catchingErrorAsync');

exports.getHome = catchingErrorAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  // console.log(req['reviews']);
  // const tour = await Tour.findOne({ slug: req.params.slug }).populate(
  //   'reviews'
  // );

  // console.log(tour);

  if (!tour) {
    return next(new AppError('Không có chuyến đi nào với tên tìm kiếm', 404));
  }

  res.status(200).render('home', { tour });
});

exports.getAdmin = catchingErrorAsync(async (req, res, next) => {
  try {
    const user = req.user;

    if (!user || user.role !== 'admin') {
      return next(
        new AppError(
          'Người dùng không tồn tại. Vui lòng đăng nhập tài khoản hợp lệ!',
          404
        )
      );
    }

    const tours = await Tour.find();
    const users = await User.find();
    const reviews = await Review.find();
    const bookings = await BookingTour.find();
    const emails = await BookingEmail.find();

    // console.log(reviews);
    const rowsPerPage = 10;

    const totalUsersPages = Math.ceil(users.length / rowsPerPage);
    const totalToursPages = Math.ceil(tours.length / rowsPerPage);
    const totalReviewsPages = Math.ceil(reviews.length / rowsPerPage);
    const totalBookingsPages = Math.ceil(bookings.length / rowsPerPage);
    const totalEmailsPages = Math.ceil(emails.length / rowsPerPage);

    res.status(200).render('admin', {
      user,
      tours,
      users,
      reviews,
      bookings,
      emails,
      totalUsersPages,
      totalToursPages,
      totalReviewsPages,
      totalBookingsPages,
      totalEmailsPages,
      currentPage: 1,
    });
  } catch (err) {
    console.log(err);
  }
});

exports.getTravel = async (req, res) => {
  const topTours = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $sort: { ratingsAverage: -1, price: 1 },
    },
    {
      $limit: 3,
    },
    // {
    //   $project: {
    //     name: 1,
    //     ratingsAverage: 1,
    //     price: 1,
    //     ratingsQuantity: 1,
    //     difficulty: 1,
    //   },
    // },
  ]);
  res.status(200).render('travel', { topTours });
};

exports.getOverview = catchingErrorAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', { tours });
});

exports.getLogin = (req, res) => {
  res.status(200).render('login');
};

exports.getAccount = (req, res) => {
  res.status(200).render('account');
};

exports.getMyTour = catchingErrorAsync(async (req, res, next) => {
  //1) find all booking
  const bookings = await BookingTour.find({ user: req.user.id });

  //2) find tour with tourID
  const bookingTourID = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: bookingTourID } });

  res.status(200).render('overview', { tours });
});

exports.getSignup = (req, res) => {
  res.status(200).render('signup');
};

exports.updateUserData = catchingErrorAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    user: updatedUser,
  });
});
