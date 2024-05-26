const express = require('express');
const viewController = require('../controllers/viewController');
const authenController = require('../controllers/authenController');
const bookingController = require('../controllers/bookingController');

const viewRouter = express.Router();

viewRouter.get(
  '/tours/:slug',
  authenController.protect,
  viewController.getHome
);

viewRouter.get('/admin', authenController.isLogin, viewController.getAdmin);

viewRouter.get('/travel', viewController.getTravel);

viewRouter.get(
  '/overview',
  bookingController.createCheckout,
  authenController.isLogin,
  viewController.getOverview
);

viewRouter.get('/login', authenController.isLogin, viewController.getLogin);

viewRouter.get('/account', authenController.protect, viewController.getAccount);
viewRouter.get('/my-tour', authenController.protect, viewController.getMyTour);

viewRouter.get('/signup', viewController.getSignup);

viewRouter.post(
  '/update-profile',
  authenController.protect,
  viewController.updateUserData
);

module.exports = viewRouter;
