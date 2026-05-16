const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const TrainingPlan = require('../models/TrainingPlan');

const router = express.Router();

router.use(auth);

// ─── GET /api/plans ─────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const plans = await TrainingPlan.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ plans });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/plans/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const plan = await TrainingPlan.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!plan) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Training plan not found',
      });
    }

    res.json({ plan });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/plans ────────────────────────────────────────────────────────
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Plan name is required'),
    body('goal')
      .isIn(['muscle_gain', 'fat_loss', 'strength', 'endurance', 'flexibility'])
      .withMessage('Invalid goal'),
    body('fitnessLevel')
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid fitness level'),
    body('duration')
      .isInt({ min: 1, max: 52 })
      .withMessage('Duration must be between 1 and 52 weeks'),
    body('frequency')
      .isInt({ min: 1, max: 7 })
      .withMessage('Frequency must be between 1 and 7 sessions/week'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const plan = new TrainingPlan({
        userId: req.user.id,
        ...req.body,
      });

      await plan.save();
      res.status(201).json({ plan });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/plans/:id ─────────────────────────────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    const allowedUpdates = [
      'name', 'goal', 'fitnessLevel', 'duration', 'frequency',
      'focusAreas', 'notes', 'progress', 'completedWorkouts', 'workoutSplit',
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const plan = await TrainingPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Training plan not found',
      });
    }

    res.json({ plan });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/plans/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const plan = await TrainingPlan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!plan) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Training plan not found',
      });
    }

    res.json({ message: 'PLAN_DELETED' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
