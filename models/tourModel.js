const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Chuyến đi phải có tên'],
      unique: true,
      maxlength: [40, 'Tên của chuyến đi không nên dài quá 40 kí tự'],
      minlength: [10, 'Tên của chuyến đi phải dài ít nhất 10 kí tự'],
    },

    slug: String,

    secretTour: {
      type: Boolean,
      default: false,
    },

    duration: {
      type: Number,
      required: [true, 'Chuyến đi phải có thời gian đi'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'Chuyến đi phải có số lượng người tối đa'],
    },

    difficulty: {
      type: String,
      require: [true, 'Chuyến đi phải có độ khó'],
      enum: {
        values: ['Dễ', 'Trung Bình', 'Khó'],
        message:
          'Độ khó của chuyến đi chỉ được dùng các từ Dễ, Trung Bình, Khó',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Chuyến đi phải có đánh giá từ 1 sao trở lên'],
      max: [5, 'Chuyến đi không được phép đánh giá vượt quá 5 sao'],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'Chuyến đi phải có giá của chuyến đi'],
    },

    summary: {
      type: String,
      required: [true, 'Chuyến đi phải có giới thiệu ngắn gọn về chuyến đi'],
    },

    description: {
      type: String,
      required: [true, 'Chuyến đi phải có mô tả chuyến đi'],
    },

    imageCover: {
      type: String,
      required: [true, 'Chuyến đi phải có ảnh nền của chuyến đi'],
    },

    images: [String],

    startDates: [Date],

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    startLocation: {
      type: [String],
      required: [true, 'Chuyến đi phải có địa điểm bắt đầu cụ thể!'],
    },

    locations: {
      type: [String],
      required: [true, 'Chuyến đi phải có địa điểm dừng chân cụ thể!'],
    },

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//document middleware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  // console.log(`Query took ${Date.now() - this.start} miliseconds`);
  next();
});

//aggregate midlleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
