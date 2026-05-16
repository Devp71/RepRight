const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');

const router = express.Router();

// All routes require authentication
router.use(auth);

// ─── GET /api/workouts ──────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [workouts, total] = await Promise.all([
      Workout.find({ userId: req.user.id })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      Workout.countDocuments({ userId: req.user.id }),
    ]);

    res.json({
      workouts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/workouts/stats ────────────────────────────────────────────────
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await Workout.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId.createFromHexString(req.user.id) } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$calories' },
          totalReps: { $sum: '$reps' },
        },
      },
    ]);

    // Calculate streak (consecutive days with workouts)
    const recentWorkouts = await Workout.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(30)
      .select('timestamp');

    let streak = 0;
    if (recentWorkouts.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const workoutDates = new Set(
        recentWorkouts.map((w) => {
          const d = new Date(w.timestamp);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      );

      let checkDate = new Date(today);
      // If no workout today, start checking from yesterday
      if (!workoutDates.has(checkDate.getTime())) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (workoutDates.has(checkDate.getTime())) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    const result = stats[0] || {
      totalWorkouts: 0,
      totalDuration: 0,
      totalCalories: 0,
      totalReps: 0,
    };

    res.json({
      ...result,
      streakDays: streak,
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/workouts ─────────────────────────────────────────────────────
router.post(
  '/',
  [
    body('exerciseName')
      .trim()
      .notEmpty()
      .withMessage('Exercise name is required'),
    body('duration')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Duration must be a non-negative number'),
    body('calories')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Calories must be a non-negative number'),
    body('sets')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Sets must be a non-negative number'),
    body('reps')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Reps must be a non-negative number'),
    body('weight')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Weight must be a non-negative number'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const workout = new Workout({
        userId: req.user.id,
        ...req.body,
      });

      await workout.save();
      res.status(201).json({ workout });
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/workouts/:id ───────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!workout) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Workout not found',
      });
    }

    res.json({ message: 'WORKOUT_DELETED' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
