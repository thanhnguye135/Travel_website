const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchingErrorAsync = require('../utils/catchingErrorAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchingErrorAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const url = `${req.protocol}://${req.get('host')}/account`;

  await new Email(newUser, url).sendWelcome();
  sendToken(newUser, 201, res);
});

exports.login = catchingErrorAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) check email && password
  if (!email || !password) {
    return next(
      new AppError('Vui lòng cung cấp mật khẩu hoặc email hợp lệ', 400)
    );
  }

  //2) check user exist && password correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError(
        'Vui lòng đăng nhập lại mật khẩu hoặc email của bạn bị sai',
        401
      )
    );
  }

  //3) everything correct
  sendToken(user, 201, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchingErrorAsync(async (req, res, next) => {
  let token;
  //1) check token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // console.log(token);
  if (!token) {
    return next(
      new AppError('Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập', 401)
    );
  }

  //2) check token correct
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) check user still exist
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new AppError('Tài khoản người dùng với token này không tồn tại', 401)
    );
  }
  // console.log(currentUser.passwordChangedAt / 1000, decode.iat);
  //4) check if user change password => token change
  // currentUser.passwordChanged(decode.iat);
  if (currentUser.passwordChanged(decode.iat)) {
    return next(
      new AppError(
        'Tài khoản đã thay đổi mật khẩu. Vui lòng đăng nhập lại',
        401
      )
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLogin = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.passwordChanged(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      req.user = currentUser;
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Bạn không được cấp quyền để thực hiện hành động này', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchingErrorAsync(async (req, res, next) => {
  //1) check user
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('Tài khoản người dùng không tồn tại', 404));
  }

  //2) gen resetToken
  const resetToken = user.resetPasswordToken();
  await user.save({ validateBeforeSave: false });

  try {
    //3) send email reset
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/reset-password/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token cài lại mật khẩu đã được gửi đến email',
    });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Có lỗi khi gửi email. Vui lòng thử lại sau'));
  }
});

exports.resetPassword = catchingErrorAsync(async (req, res, next) => {
  //1) get user with token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) check user exist and token expires
  if (!user) {
    return next(new AppError('Token của bạn đã hết hạn hoặc không đúng', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //3) correct => send user token
  sendToken(user, 200, res);
});

exports.updatePassword = catchingErrorAsync(async (req, res, next) => {
  //1) get user
  const user = await User.findById(req.user.id).select('+password');

  //2) check password
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Mật khẩu hiện tại không đúng', 401));
  }

  //3) correct => update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4) log in user and send JWT
  sendToken(user, 200, res);
});
