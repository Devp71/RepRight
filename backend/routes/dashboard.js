const express = require('express');
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');
const FormAnalysis = require('../models/FormAnalysis');

const router = express.Router();

router.use(auth);

// ─── GET /api/dashboard/stats ───────────────────────────────────────────────
// Aggregates data from both Workouts and FormAnalysis for the main dashboard
router.get('/stats', async (req, res, next) => {
  try {
    const userId = require('mongoose').Types.ObjectId.createFromHexString(req.user.id);

    // Run all aggregations in parallel
    const [workoutStats, formStats, recentSessions, dailyVolume] = await Promise.all([
      // 1. Workout totals
      Workout.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalWorkouts: { $sum: 1 },
            totalDuration: { $sum: '$duration' },
            totalCalories: { $sum: '$calories' },
            totalReps: { $sum: '$reps' },
          },
        },
      ]),

      // 2. Form analysis totals (estimate duration for old sessions missing it)
      FormAnalysis.aggregate([
        { $match: { userId } },
        {
          $addFields: {
            effectiveDuration: {
              $cond: {
                if: { $gt: ['$duration', 0] },
                then: '$duration',
                else: { $multiply: ['$reps', 5] } // ~5s per rep estimate for old data
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            totalReps: { $sum: '$reps' },
            totalDuration: { $sum: '$effectiveDuration' },
            avgScore: { $avg: '$score' },
          },
        },
      ]),

      // 3. Recent form-analysis sessions (last 20, newest first)
      FormAnalysis.find({ userId: req.user.id })
        .sort({ timestamp: -1 })
        .limit(20)
        .select('exercise reps score duration timestamp'),

      // 4. Daily volume for the last 7 days (from form-analysis)
      FormAnalysis.aggregate([
        {
          $match: {
            userId,
            timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $addFields: {
            effectiveDuration: {
              $cond: {
                if: { $gt: ['$duration', 0] },
                then: '$duration',
                else: { $multiply: ['$reps', 5] }
              }
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
            },
            volume: { $sum: '$reps' },
            sessions: { $sum: 1 },
            avgScore: { $avg: '$score' },
            totalDuration: { $sum: '$effectiveDuration' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Calculate streak
    const recentWorkouts = await Workout.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(30)
      .select('timestamp');

    const recentFormSessions = await FormAnalysis.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(30)
      .select('timestamp');

    // Merge workout and form-analysis dates for streak
    const allDates = new Set();
    [...recentWorkouts, ...recentFormSessions].forEach(w => {
      const d = new Date(w.timestamp);
      d.setHours(0, 0, 0, 0);
      allDates.add(d.getTime());
    });

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = new Date(today);
    if (!allDates.has(checkDate.getTime())) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    while (allDates.has(checkDate.getTime())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    const ws = workoutStats[0] || { totalWorkouts: 0, totalDuration: 0, totalCalories: 0, totalReps: 0 };
    const fs = formStats[0] || { totalSessions: 0, totalReps: 0, totalDuration: 0, avgScore: 0 };

    // Build day labels for last 7 days
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const found = dailyVolume.find(dv => dv._id === key);
      last7Days.push({
        day: dayNames[d.getDay()],
        date: key,
        volume: found ? found.volume : 0,
        sessions: found ? found.sessions : 0,
        avgScore: found ? Math.round(found.avgScore) : 0,
        duration: found ? found.totalDuration : 0,
      });
    }

    res.json({
      // Combined stats
      totalSessions: ws.totalWorkouts + fs.totalSessions,
      totalDuration: ws.totalDuration + fs.totalDuration, // in seconds
      totalCalories: ws.totalCalories,
      totalReps: ws.totalReps + fs.totalReps,
      avgFormScore: Math.round(fs.avgScore || 0),
      streakDays: streak,
      formSessions: fs.totalSessions,
      // Chart data
      dailyVolume: last7Days,
      recentSessions: recentSessions.map(s => ({
        exercise: s.exercise,
        reps: s.reps,
        score: s.score,
        duration: s.duration,
        timestamp: s.timestamp,
      })),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
