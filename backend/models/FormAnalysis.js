const mongoose = require('mongoose');

const formAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    exercise: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
    },
    reps: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    angleData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    feedback: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

formAnalysisSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('FormAnalysis', formAnalysisSchema);
