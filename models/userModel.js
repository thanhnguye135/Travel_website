const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Người dùng phải có họ tên'],
  },

  email: {
    type: String,
    required: [true, 'Người dùng phải có email'],
    unique: true,
    lowercase: true,
    validate: validator.isEmail,
  },

  photo: {
    type: String,
    default: 'default.jpg',
  },

  password: {
    type: String,
    required: [true, 'Người dùng phải có mật khẩu'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Người dùng phải có xác nhận lại mật khẩu'],
    validate: {
      validator: function (val) {
        return this.password === val;
      },

      message: 'Hai mật khẩu phải trùng khớp',
    },
  },

  passwordChangedAt: Date,

  passwordResetToken: String,

  passwordResetExpires: Date,

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcryptjs.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcryptjs.compare(inputPassword, userPassword);
};

userSchema.methods.passwordChanged = function (JWTTime) {
  if (this.passwordChangedAt) {
    const timeChange = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTime < timeChange;
  }

  return false;
};

userSchema.methods.resetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // console.log(resetToken, this.passwordResetToken);

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
