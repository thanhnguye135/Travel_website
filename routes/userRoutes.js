const express = require('express');
const userController = require('../controllers/userController');
const authenController = require('../controllers/authenController');
const userRouter = express.Router();

userRouter.post('/sign-up', authenController.signup);
userRouter.post('/log-in', authenController.login);
userRouter.get('/log-out', authenController.logout);

userRouter.post('/forgot-password', authenController.forgotPassword);
userRouter.patch('/reset-password/:token', authenController.resetPassword);

userRouter.use(authenController.protect);

userRouter.patch('/update-password', authenController.updatePassword);

userRouter.patch(
  '/update-profile',
  userController.uploadUserPhoto,
  userController.updateProfile
);

userRouter.delete('/delete-profile', userController.deleteProfile);

userRouter.route('/me').get(userController.getMe, userController.getUser);

userRouter.use(authenController.restrictTo('admin'));

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

userRouter
  .route('/:id')
  .patch(userController.uploadUserPhoto, userController.updateUser);
module.exports = userRouter;
