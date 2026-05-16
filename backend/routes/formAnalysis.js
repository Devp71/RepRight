const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const FormAnalysis = require('../models/FormAnalysis');

const router = express.Router();

router.use(auth);

// ─── GET /api/form-analysis ─────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [analyses, total] = await Promise.all([
      FormAnalysis.find({ userId: req.user.id })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      FormAnalysis.countDocuments({ userId: req.user.id }),
    ]);

    res.json({
      analyses,
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

// ─── POST /api/form-analysis ────────────────────────────────────────────────
router.post(
  '/',
  [
    body('exercise')
      .trim()
      .notEmpty()
      .withMessage('Exercise name is required'),
    body('reps')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Reps must be non-negative'),
    body('score')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Score must be between 0 and 100'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const analysis = new FormAnalysis({
        userId: req.user.id,
        ...req.body,
      });

      await analysis.save();
      res.status(201).json({ analysis });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
