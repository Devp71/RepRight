const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true },
    rest: { type: Number, default: 90 },
  },
  { _id: false }
);

const workoutDaySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    focus: { type: String, required: true },
    exercises: [exerciseSchema],
  },
  { _id: false }
);

const trainingPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    goal: {
      type: String,
      enum: ['muscle_gain', 'fat_loss', 'strength', 'endurance', 'flexibility'],
      required: true,
    },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: [1, 'Duration must be at least 1 week'],
      max: [52, 'Duration cannot exceed 52 weeks'],
    },
    frequency: {
      type: Number,
      required: true,
      min: [1, 'Frequency must be at least 1 session/week'],
      max: [7, 'Frequency cannot exceed 7 sessions/week'],
    },
    focusAreas: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedWorkouts: {
      type: Number,
      default: 0,
    },
    workoutSplit: [workoutDaySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TrainingPlan', trainingPlanSchema);
