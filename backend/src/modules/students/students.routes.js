const express = require('express');
const studentsController = require('./students.controller');
const {
  validateProfile,
  validateSkill,
  validateProject,
  validateCertification,
  validateAchievement
} = require('./students.validator');
const authenticate = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/role.middleware');
const { uploadResume } = require('../../middlewares/upload.middleware');

const router = express.Router();

// All student portfolio endpoints require authentication and student role
router.use(authenticate, authorizeRoles('student'));

// Profile management
router.get('/profile', (req, res, next) => studentsController.getProfile(req, res, next));
router.post('/profile', validateProfile, (req, res, next) => studentsController.createOrUpdateProfile(req, res, next));
router.put('/profile', validateProfile, (req, res, next) => studentsController.createOrUpdateProfile(req, res, next));

// Resume upload
router.post('/resume', uploadResume.single('resume'), (req, res, next) => studentsController.uploadResume(req, res, next));

// Skills management
router.post('/skills', validateSkill, (req, res, next) => studentsController.addSkill(req, res, next));
router.delete('/skills/:skillName', (req, res, next) => studentsController.deleteSkill(req, res, next));

// Projects management
router.post('/projects', validateProject, (req, res, next) => studentsController.addProject(req, res, next));
router.put('/projects/:projectId', validateProject, (req, res, next) => studentsController.updateProject(req, res, next));
router.delete('/projects/:projectId', (req, res, next) => studentsController.deleteProject(req, res, next));

// Certifications management
router.post('/certifications', validateCertification, (req, res, next) => studentsController.addCertification(req, res, next));
router.delete('/certifications/:certId', (req, res, next) => studentsController.deleteCertification(req, res, next));

// Achievements management
router.post('/achievements', validateAchievement, (req, res, next) => studentsController.addAchievement(req, res, next));
router.delete('/achievements/:achievementId', (req, res, next) => studentsController.deleteAchievement(req, res, next));

module.exports = router;
