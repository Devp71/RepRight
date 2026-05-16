const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const VoiceSession = require('../models/VoiceSession');

const router = express.Router();

router.use(auth);

// ─── GET /api/voice-sessions ────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const sessions = await VoiceSession.find({ userId: req.user.id })
      .sort({ completedAt: -1 })
      .limit(50);

    res.json({ sessions });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/voice-sessions ───────────────────────────────────────────────
router.post(
  '/',
  [
    body('exercise')
      .trim()
      .notEmpty()
      .withMessage('Exercise name is required'),
    body('duration')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Duration must be non-negative'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const session = new VoiceSession({
        userId: req.user.id,
        ...req.body,
      });

      await session.save();
      res.status(201).json({ session });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
