const multer = require('multer');
// const sharp = require('sharp');
const catchingErrorAsync = require('../utils/catchingErrorAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },

  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

// const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Không có ảnh nào. Vui lòng tải ảnh lên!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

// exports.resizeUserPhoto = (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/users/`);

//   next();
// };

const filterObj = (obj, ...allowedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFileds.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = catchingErrorAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.updateProfile = catchingErrorAsync(async (req, res, next) => {
  // console.log(req.file, req.body);
  //1) check user has password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('Đường dẫn này không dành cho đặt lại mật khẩu', 400)
    );
  }

  //2) update user
  const filterBody = filterObj(req.body, 'name', 'email');
  if (req.file) filterBody.photo = req.file.filename;
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteProfile = catchingErrorAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = catchingErrorAsync(async (req, res, next) => {
  const user = await User.find({ _id: req.params.id });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message:
      'Đường dẫn này chưa được xác định! Vui lòng sử dụng /sign-up thay thế',
  });
};

exports.updateUser = catchingErrorAsync(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(
      new AppError('Không tài liệu nào được tìm thấy với id này', 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      user: doc,
    },
  });
});

exports.deleteUser = catchingErrorAsync(async (req, res, next) => {
  const doc = await User.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(
      new AppError('Không tài liệu nào được tìm thấy với id này', 404)
    );
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
