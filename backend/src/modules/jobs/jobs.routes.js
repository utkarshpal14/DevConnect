const express = require('express');
const { body, validationResult } = require('express-validator');
const jobsController = require('./jobs.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/role.middleware');

const router = express.Router();

const validateJob = [
  body('title').trim().notEmpty().withMessage('Job title is required').isLength({ max: 150 }).withMessage('Job title cannot exceed 150 characters'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('requiredSkills').isArray({ min: 1 }).withMessage('At least one required skill is needed'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('employmentType').isIn(['Internship', 'Full-Time', 'Part-Time', 'Contract']).withMessage('Invalid employment type'),
  body('applicationDeadline').optional().isISO8601().withMessage('Application deadline must be a valid date'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
    next();
  }
];

router.get('/', (req, res, next) => jobsController.list(req, res, next));
router.get('/:jobId', (req, res, next) => jobsController.getOne(req, res, next));
router.use(authenticate, authorizeRoles('recruiter'));
router.post('/', validateJob, (req, res, next) => jobsController.create(req, res, next));
router.put('/:jobId', validateJob, (req, res, next) => jobsController.update(req, res, next));
router.delete('/:jobId', (req, res, next) => jobsController.remove(req, res, next));
router.patch('/:jobId/close', (req, res, next) => jobsController.close(req, res, next));

module.exports = router;
