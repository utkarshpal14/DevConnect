/**
 * AI Service Routes
 * Milestone 5: AI Skill Gap Analyzer & Student Career Intelligence
 */

const express = require('express');
const router = express.Router();
const SkillGapController = require('../controllers/skillGap.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

// GET /api/v1/ai/skill-gap/roles - List available career taxonomy roles
router.get(
  '/skill-gap/roles',
  authenticate,
  authorizeRoles('student'),
  SkillGapController.getSupportedRoles
);

// POST /api/v1/ai/skill-gap - Compute student skill gap and learning recommendations
router.post(
  '/skill-gap',
  authenticate,
  authorizeRoles('student'),
  SkillGapController.analyzeSkillGap
);

module.exports = router;
