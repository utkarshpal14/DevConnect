const express = require('express');
const { body, validationResult } = require('express-validator');
const applicationsController = require('./applications.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/role.middleware');

const router = express.Router();
const allowedStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'];

const validate = (checks) => [
  ...checks,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
    next();
  }
];

router.post('/', authenticate, authorizeRoles('student'), validate([
  body('jobId').isMongoId().withMessage('Valid job ID is required')
]), (req, res, next) => applicationsController.apply(req, res, next));
router.patch('/:applicationId/withdraw', authenticate, authorizeRoles('student'), (req, res, next) => applicationsController.withdraw(req, res, next));
router.get('/my', authenticate, authorizeRoles('student'), (req, res, next) => applicationsController.mine(req, res, next));
router.get('/job/:jobId', authenticate, authorizeRoles('recruiter'), (req, res, next) => applicationsController.applicants(req, res, next));
router.patch('/:applicationId/status', authenticate, authorizeRoles('recruiter'), validate([
  body('status').isIn(allowedStatuses).withMessage('Invalid application status')
]), (req, res, next) => applicationsController.updateStatus(req, res, next));

module.exports = router;
