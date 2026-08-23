const express = require('express');
const { body, validationResult } = require('express-validator');
const recruitersController = require('./recruiters.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/role.middleware');

const router = express.Router();

const validateProfile = [
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 150 })
    .withMessage('Company name cannot exceed 150 characters'),
  body('companyWebsite').optional().isURL().withMessage('Company website must be a valid URL'),
  body('companyDescription')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Company description cannot exceed 2000 characters'),
  body('companyLogoUrl').optional().isURL().withMessage('Company logo URL must be a valid URL'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Location cannot exceed 150 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    next();
  }
];

router.use(authenticate, authorizeRoles('recruiter'));
router.get('/profile', (req, res, next) => recruitersController.getProfile(req, res, next));
router.post('/profile', validateProfile, (req, res, next) => recruitersController.createOrUpdateProfile(req, res, next));
router.put('/profile', validateProfile, (req, res, next) => recruitersController.createOrUpdateProfile(req, res, next));

module.exports = router;
