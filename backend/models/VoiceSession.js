const mongoose = require('mongoose');

const voiceSessionSchema = new mongoose.Schema(
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
    duration: {
      type: Number,
      default: 0,
      min: [0, 'Duration cannot be negative'],
    },
    settings: {
      voiceStyle: {
        type: String,
        enum: ['motivational', 'technical', 'minimal'],
        default: 'motivational',
      },
      speakingPace: {
        type: String,
        enum: ['slow', 'normal', 'fast'],
        default: 'normal',
      },
      frequency: {
        type: String,
        enum: ['every_rep', 'every_set', 'form_tips'],
        default: 'every_set',
      },
      includeFormTips: {
        type: Boolean,
        default: true,
      },
      volume: {
        type: Number,
        default: 80,
        min: 0,
        max: 100,
      },
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('VoiceSession', voiceSessionSchema);
