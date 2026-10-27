/**
 * AI Service Routes
 * Milestone 5: AI Skill Gap Analyzer & Student Career Intelligence
 */

const express = require('express');
const router = express.Router();
const SkillGapController = require('../controllers/skillGap.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const CandidateMatchingController = require('../controllers/candidateMatching.controller');
const ResumeParserController = require('../controllers/resumeParser.controller');
const { uploadResume } = require('../middlewares/upload.middleware');

// ==========================================
// Milestone 5: Student Skill Gap Analysis
// ==========================================

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

// ==========================================
// Milestone 6: Recruiter Candidate Match Engine
// ==========================================

// POST /api/v1/ai/match-candidate - Compute match score between applicant and job
router.post(
  '/match-candidate',
  authenticate,
  authorizeRoles('recruiter', 'admin'),
  CandidateMatchingController.matchCandidate
);

// GET /api/v1/ai/match-candidate/job/:jobId - Retrieve stored match evaluations for a job
router.get(
  '/match-candidate/job/:jobId',
  authenticate,
  authorizeRoles('recruiter', 'admin'),
  CandidateMatchingController.getJobMatchResults
);

// ==========================================
// Milestone 7: AI Resume Parsing Engine
// ==========================================

// POST /api/v1/ai/parse-resume - Ingest and parse student PDF resume
router.post(
  '/parse-resume',
  authenticate,
  authorizeRoles('student', 'admin'),
  uploadResume.single('resume'),
  ResumeParserController.parseResume
);

module.exports = router;

