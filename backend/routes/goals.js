const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const Goal = require('../models/Goal');

const router = express.Router();

router.use(auth);

// ─── GET /api/goals ─────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ goals });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/goals ────────────────────────────────────────────────────────
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Goal name is required'),
    body('target')
      .isInt({ min: 1 })
      .withMessage('Target must be at least 1'),
    body('unit')
      .optional()
      .isIn(['lbs', 'reps', 'sessions', 'km'])
      .withMessage('Invalid unit'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const goal = new Goal({
        userId: req.user.id,
        ...req.body,
      });

      await goal.save();
      res.status(201).json({ goal });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/goals/:id ────────────────────────────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Goal not found',
      });
    }

    // Update allowed fields
    if (req.body.name !== undefined) goal.name = req.body.name;
    if (req.body.target !== undefined) goal.target = req.body.target;
    if (req.body.current !== undefined) goal.current = req.body.current;
    if (req.body.unit !== undefined) goal.unit = req.body.unit;

    // Progress is auto-computed by pre-save hook
    await goal.save();

    res.json({ goal });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/goals/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Goal not found',
      });
    }

    res.json({ message: 'GOAL_DELETED' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
