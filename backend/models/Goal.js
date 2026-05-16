const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Goal name is required'],
      trim: true,
    },
    target: {
      type: Number,
      required: [true, 'Target value is required'],
      min: [1, 'Target must be at least 1'],
    },
    current: {
      type: Number,
      default: 0,
      min: [0, 'Current value cannot be negative'],
    },
    unit: {
      type: String,
      enum: ['lbs', 'reps', 'sessions', 'km'],
      default: 'lbs',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-compute progress before saving
goalSchema.pre('save', function (next) {
  if (this.target > 0) {
    this.progress = Math.min(Math.round((this.current / this.target) * 100), 100);
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema);
