const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `${err.path}: ${err.value} đường dẫn không hợp lệ.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Giá trị bị lặp lại: ${value}. Vui lòng thử giá trị khác!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Dữ liệu nhập vào không hợp lệ. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleExpiredError = () => {
  return new AppError('Hết hạn thời gian. Vui lòng đăng nhập lại', 400);
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    return res.status(err.statusCode).render('error', {
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error('ERROR 💥', err);

      // 2) Send generic message
      return res.status(500).json({
        status: 'error',
        message: 'Có gì đó sai ở đây!',
      });
    }
  } else {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).render('/error', {
        msg: err.message,
      });

      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error('ERROR 💥', err);

      // 2) Send generic message
      return res.status(500).json({
        status: 'error',
        msg: 'Có gì đó sai ở đây!',
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    // console.log(error);
    if (error.kind === 'ObjectId') {
      error = handleCastErrorDB(error);
    }

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error._message === 'Validation failed')
      error = handleValidationErrorDB(error);
    if (error.name === 'TokenExpiredError') error = handleExpiredError();

    // sendErrorProd(error, res);
    sendErrorProd(error, req, res);
  }
};
