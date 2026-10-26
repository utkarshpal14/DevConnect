const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    });
  }
  next();
};

const validateProfile = [
  body('headline')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 120 })
    .withMessage('Headline cannot exceed 120 characters'),
  body('bio')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio cannot exceed 1000 characters'),
  body('githubUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid GitHub URL'),
  body('linkedinUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),
  body('portfolioUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid Portfolio URL'),
  body('education.cgpa')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 10 })
    .withMessage('CGPA must be a number between 0.0 and 10.0'),
  body('education.graduationYear')
    .optional({ checkFalsy: true })
    .isInt({ min: 1950, max: 2100 })
    .withMessage('Graduation year must be a valid 4-digit year'),
  handleValidationErrors
];

const validateSkill = [
  body('skill')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required')
    .isLength({ max: 50 })
    .withMessage('Skill name cannot exceed 50 characters'),
  handleValidationErrors
];

const validateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 150 })
    .withMessage('Project title cannot exceed 150 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 2000 })
    .withMessage('Project description cannot exceed 2000 characters'),
  body('techStack')
    .optional()
    .isArray()
    .withMessage('Tech stack must be an array of strings'),
  body('githubUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid GitHub URL'),
  body('liveUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid Live Demo URL'),
  handleValidationErrors
];

const validateCertification = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Certification title is required'),
  body('issuer')
    .trim()
    .notEmpty()
    .withMessage('Issuing organization is required'),
  body('issueDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Issue date must be a valid date format (YYYY-MM-DD)'),
  body('certificateUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid Certificate URL'),
  handleValidationErrors
];

const validateAchievement = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Achievement title is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Achievement description is required'),
  body('achievementDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Achievement date must be a valid date format (YYYY-MM-DD)'),
  handleValidationErrors
];

module.exports = {
  validateProfile,
  validateSkill,
  validateProject,
  validateCertification,
  validateAchievement
};
