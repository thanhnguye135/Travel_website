const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const BookingTour = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchingErrorAsync = require('../utils/catchingErrorAsync');

exports.getCheckoutSession = async (req, res, next) => {
  //1) get tour
  const tour = await Tour.findById(req.params.tourID);

  //2) checkout session
  const session = await stripe.checkout.session.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Chuyến đi`,
        description: `${tour.summary}`,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  console.log(session);
  //3) create session
  res.status(200).json({
    status: 'success',
    session,
  });
};

exports.createCheckout = async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await BookingTour.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0]);
  next();
};

exports.createBooking = catchingErrorAsync(async (req, res, next) => {});

exports.getBooking = catchingErrorAsync(async (req, res, next) => {});

exports.getAllBookings = catchingErrorAsync(async (req, res, next) => {});

exports.updateBooking = catchingErrorAsync(async (req, res, next) => {});

exports.deleteBooking = catchingErrorAsync(async (req, res, next) => {});
